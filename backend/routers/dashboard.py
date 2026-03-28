from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models, schemas, auth, database
import datetime
import random

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

def init_db_data(db: Session):
    if not db.query(models.DashboardStat).first():
        stat = models.DashboardStat()
        db.add(stat)
        db.commit()

@router.get("", response_model=schemas.DashboardData)
def get_dashboard_data(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    init_db_data(db)
    
    stat = db.query(models.DashboardStat).first()
    
    # Get user's actual activities
    activities = db.query(models.Activity).filter(models.Activity.owner_id == current_user.id).all()
    
    safe_count = sum(1 for a in activities if a.status == "safe")
    suspicious_count = sum(1 for a in activities if a.status == "suspicious")
    dangerous_count = sum(1 for a in activities if a.status == "dangerous")
    
    stats_data = [
        {"label": 'Total Schemes', "value": str(stat.total_schemes), "icon": "Search", "color": 'text-blue-400', "bg": 'bg-blue-400/10'},
        {"label": 'Safe Links Scanned', "value": str(safe_count), "icon": "CheckCircle", "color": 'text-green-400', "bg": 'bg-green-400/10'},
        {"label": 'Threats Detected', "value": str(suspicious_count + dangerous_count), "icon": "ShieldAlert", "color": 'text-red-400', "bg": 'bg-red-400/10'},
        {"label": 'System Health', "value": f"{stat.system_health}%", "icon": "Activity", "color": 'text-purple-400', "bg": 'bg-purple-400/10'}
    ]

    risk_data = [
        {"name": 'Safe', "value": safe_count, "color": '#22c55e'},
        {"name": 'Suspicious', "value": suspicious_count, "color": '#eab308'},
        {"name": 'Dangerous', "value": dangerous_count, "color": '#ef4444'}
    ]

    # Generate last 7 days activity
    today = datetime.datetime.utcnow().date()
    activity_data = []
    
    for i in range(6, -1, -1):
        target_date = today - datetime.timedelta(days=i)
        day_str = target_date.strftime("%a")
        
        checks_on_day = sum(1 for a in activities if a.date.date() == target_date)
        matches_on_day = sum(1 for a in activities if a.date.date() == target_date and a.status == "safe")
        
        activity_data.append({
            "day": day_str,
            "checks": checks_on_day,
            "matches": matches_on_day
        })
        
    recent = db.query(models.Activity).filter(models.Activity.owner_id == current_user.id).order_by(models.Activity.date.desc()).limit(5).all()
    
    return schemas.DashboardData(
        stats=stats_data,
        riskData=risk_data,
        activityData=activity_data,
        recentChecks=[
            {"url": a.url, "status": a.status, "score": a.score, "date": str(a.date)} 
            for a in recent
        ],
        recommendedSchemes=[]
    )

@router.post("/activity", response_model=schemas.Activity)
def create_activity(activity: schemas.ActivityBase, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    db_activity = models.Activity(
        url=activity.url,
        status=activity.status,
        score=activity.score,
        owner_id=current_user.id
    )
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity
