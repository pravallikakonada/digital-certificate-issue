"""
This script removes ALL exam submissions from the database.
This will completely clear the /completed-tests page.

WARNING: This is a destructive operation. All student test completion records will be deleted.

Usage: python clear_all_submissions.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.exams.models import ExamSubmission

# Get count before deletion
count_before = ExamSubmission.objects.count()
print(f"Exam submissions before deletion: {count_before}")

# Delete all submissions
deleted_count, _ = ExamSubmission.objects.all().delete()

# Get count after deletion
count_after = ExamSubmission.objects.count()
print(f"\nDeleted: {deleted_count} exam submissions")
print(f"Exam submissions remaining: {count_after}")
print("\n✓ All exam submissions have been removed from the database.")
