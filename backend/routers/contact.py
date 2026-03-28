from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv(override=True)

router = APIRouter(prefix="/api/contact", tags=["contact"])

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

@router.post("")
async def send_contact_email(form: ContactForm):
    email_user = os.getenv("EMAIL_USER", "sgrid.work@gmail.com")
    email_password = os.getenv("EMAIL_PASSWORD")
    
    if not email_password or email_password == "your_app_password_here":
        raise HTTPException(
            status_code=400, 
            detail="Email password not configured. Please add your Gmail App Password to the .env file."
        )

    try:
        # Create the email message
        msg = MIMEMultipart()
        msg['From'] = email_user
        msg['To'] = email_user # Send to oneself as requested
        msg['Subject'] = f"GovAssistant Complaint: {form.subject}"
        
        body = f"""
        New Complaint/Contact from GovAssistant:
        
        Name: {form.name}
        Email: {form.email}
        Subject: {form.subject}
        
        Message:
        {form.message}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Connect to Gmail SMTP server using SSL on Port 465
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(email_user, email_password)
        text = msg.as_string()
        server.sendmail(email_user, email_user, text)
        server.quit()
        
        return {"status": "success", "message": "Email sent successfully"}
    except smtplib.SMTPAuthenticationError as e:
        print(f"SMTP Authentication Error: {e}")
        raise HTTPException(
            status_code=401, 
            detail=f"Authentication Failed: {str(e)}. Your password might be a normal Gmail password. You MUST use a 16-character 'App Password' from Google Account settings."
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Error sending email: {e}")
        raise HTTPException(status_code=500, detail=f"Mail Error: {str(e)}")
