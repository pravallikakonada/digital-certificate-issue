"""
This script removes fake sample exam submissions from the database.
Run this once to clean up any fake test data created by create_sample_data.py

Usage: python clean_sample_data.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.exams.models import ExamSubmission

# Remove only the fake sample submissions by email
fake_emails = [
    'john@example.com',
    'jane@example.com',
    'bob@example.com',
]

count = 0
for email in fake_emails:
    deleted, _ = ExamSubmission.objects.filter(student_email=email).delete()
    count += deleted
    print(f"Deleted {deleted} submissions for {email}")

print(f"\nTotal fake submissions removed: {count}")
print(f"Remaining real submissions: {ExamSubmission.objects.count()}")
