import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from backend.exams.models import ExamSubmission

# Create sample exam submissions
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