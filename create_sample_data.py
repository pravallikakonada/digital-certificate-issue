"""
DEPRECATED: This script creates FAKE sample exam submissions for testing only.

WARNING: Do NOT run this script in production. It will pollute your database with 
fake student test submissions that have nothing to do with real student progress.

If you've already run this and want to remove the fake data, run:
    python clean_sample_data.py

For local development testing only - use only if you understand the consequences.
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.exams.models import ExamSubmission

# FAKE sample exam submissions - DO NOT USE IN PRODUCTION
submissions = [
    {
        'student_name': 'John Doe',
        'student_email': 'john@example.com',
        'course_title': 'Python Programming',
        'score': 8,
        'total_questions': 10,
        'result': 'Passed',
        'eligible_for_certificate': True,
        'status': 'Completed'
    },
    {
        'student_name': 'Jane Smith',
        'student_email': 'jane@example.com',
        'course_title': 'Web Development',
        'score': 6,
        'total_questions': 10,
        'result': 'Passed',
        'eligible_for_certificate': True,
        'status': 'Completed'
    },
    {
        'student_name': 'Bob Johnson',
        'student_email': 'bob@example.com',
        'course_title': 'Data Science',
        'score': 4,
        'total_questions': 10,
        'result': 'Failed',
        'eligible_for_certificate': False,
        'status': 'Completed'
    }
]

for submission_data in submissions:
    ExamSubmission.objects.get_or_create(
        student_email=submission_data['student_email'],
        course_title=submission_data['course_title'],
        defaults=submission_data
    )

print("Sample exam submissions created!")