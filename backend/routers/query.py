from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import models, schemas, auth, database
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/queries", tags=["queries"])

def send_acknowledgement_email(user_email: str, subject: str, message_content: str):
    email_user = os.getenv("EMAIL_USER")
    email_password = os.getenv("EMAIL_PASSWORD")
    
    if not email_user or not email_password:
        print("Email credentials not found in .env. Skipping email.")
        return

    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = f"SUDARSHAN GRID <{email_user}>"
        msg['To'] = user_email
        msg['Subject'] = f"Acknowledgement: {subject}"

        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background: #0f172a; padding: 20px; color: white; text-align: center; border-radius: 8px 8px 0 0;">
                <h2 style="margin: 0; color: #3b82f6;">SUDARSHAN GRID</h2>
                <p style="margin: 5px 0 0;">AI That Understands Bharat</p>
            </div>
            <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
                <h3>Hello,</h3>
                <p>We have received your query regarding <strong>"{subject}"</strong>.</p>
                <p style="background: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; italic: true;">
                    "{message_content}"
                </p>
                <p>Our team and AI assistants are reviewing your request. We will notify you via the dashboard once there is an update or if the scheme becomes available.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                <p style="font-size: 12px; color: #64748b;">This is an automated acknowledgement from SUDARSHAN GRID. Please do not reply to this email.</p>
            </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(body, 'html'))

        # Connect to server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(email_user, email_password)
        server.send_message(msg)
        server.quit()
        print(f"Acknowledgement email sent to {user_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

@router.post("", response_model=schemas.QueryOut)
async def create_query(
    request: schemas.QueryCreate, 
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(database.get_db)
):
    # 1. Save to DB
    new_query = models.SupportQuery(
        subject=request.subject,
        message=request.message,
        owner_id=current_user.id
    )
    db.add(new_query)
    db.commit()
    db.refresh(new_query)
    
    # 2. Add email task to background
    background_tasks.add_task(
        send_acknowledgement_email, 
        current_user.email, 
        request.subject, 
        request.message
    )
    
    return new_query

@router.get("", response_model=list[schemas.QueryOut])
async def get_my_queries(
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(database.get_db)
):
    return db.query(models.SupportQuery).filter(models.SupportQuery.owner_id == current_user.id).order_by(models.SupportQuery.date.desc()).all()
