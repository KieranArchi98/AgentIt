"""Email service integration using SendGrid."""
import os
from typing import List, Optional
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content

class EmailService:
    """Email service using SendGrid."""
    
    def __init__(self):
        """Initialize the email service."""
        self.api_key = os.getenv("SENDGRID_API_KEY")
        self.from_email = os.getenv("SENDGRID_FROM_EMAIL")
        self.client = SendGridAPIClient(self.api_key) if self.api_key else None

    async def send_email(
        self,
        to_email: str,
        subject: str,
        content: str,
        cc: Optional[List[str]] = None,
        bcc: Optional[List[str]] = None
    ) -> bool:
        """Send an email using SendGrid."""
        if not self.client:
            raise ValueError("SendGrid API key not configured")

        message = Mail(
            from_email=self.from_email,
            to_emails=to_email,
            subject=subject,
            html_content=content
        )

        if cc:
            message.cc = [To(email) for email in cc]
        if bcc:
            message.bcc = [To(email) for email in bcc]

        try:
            response = self.client.send(message)
            return response.status_code in (200, 201, 202)
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return False

    async def send_welcome_email(self, user_email: str, username: str) -> bool:
        """Send a welcome email to new users."""
        subject = "Welcome to Our Platform!"
        content = f"""
        <h1>Welcome {username}!</h1>
        <p>Thank you for joining our platform. We're excited to have you on board!</p>
        <p>Get started by:</p>
        <ul>
            <li>Completing your profile</li>
            <li>Joining discussions</li>
            <li>Following topics that interest you</li>
        </ul>
        """
        return await self.send_email(user_email, subject, content)

email_service = EmailService() 