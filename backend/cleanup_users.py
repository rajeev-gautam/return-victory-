from database import SessionLocal
from models import User, Activity

db = SessionLocal()
users = db.query(User).filter(User.email.like("%sample%")).all()
for user in users:
    print(f"Deleting user: {user.email}")
    db.query(Activity).filter(Activity.owner_id == user.id).delete()
    db.delete(user)
db.commit()
print("Cleanup complete.")
db.close()
