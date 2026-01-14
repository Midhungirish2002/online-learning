import os
import django
from django.core.mail import send_mail
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def test_email():
    print(f"Testing email config:")
    print(f"Host: {settings.EMAIL_HOST}")
    print(f"User: {settings.EMAIL_HOST_USER}")
    
    pwd = settings.EMAIL_HOST_PASSWORD
    if pwd:
        print(f"Password Length: {len(pwd)}")
        print(f"Password Start: {pwd[:2]}***")
        print(f"Contains Spaces: {' ' in pwd}")
    else:
        print("Password: NONE")
    
    try:
        send_mail(
            subject='Re-Verification Email',
            message='Testing credentials again.',
            from_email=None,
            recipient_list=["midhungkaimal93@gmail.com"],
            fail_silently=False,
        )
        print("Email sent successfully!")
    except Exception as e:
        print(f"Email failed: {e}")

if __name__ == "__main__":
    test_email()
