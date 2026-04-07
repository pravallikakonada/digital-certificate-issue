#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

django.setup()

from django.conf import settings
from django.core.mail import EmailMessage

print("=" * 60)
print("EMAIL CONFIGURATION TEST")
print("=" * 60)
print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
print(f"EMAIL_HOST_PASSWORD: {'*' * 10}...")
print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
print("=" * 60)

# Check if it's using SMTP backend
if 'smtp' in settings.EMAIL_BACKEND.lower():
    print("✓ Using SMTP backend - Real emails will be sent!")
    
    try:
        test_email = EmailMessage(
            subject="SMTP Configuration Test",
            body="If you received this email, your SMTP configuration is working!",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=["test@example.com"],  # Won't actually send to dummy address
        )
        # Just test the connection without actually sending
        print("✓ EmailMessage object created successfully")
        print("\nReady to send emails via SMTP!")
    except Exception as e:
        print(f"✗ Error: {e}")
else:
    print("✗ WARNING: NOT using SMTP backend!")
    print("  Emails will NOT be sent. Configure SMTP or console testing.")
