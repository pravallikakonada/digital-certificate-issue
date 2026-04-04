import requests

# Test the courses API
try:
    response = requests.get('http://127.0.0.1:8000/api/courses/')
    print(f'Courses API Status: {response.status_code}')
    print(f'Courses API Response: {response.text[:200]}')
except Exception as e:
    print(f'Courses API Error: {e}')

# Test the send exam API with OPTIONS
try:
    response = requests.options('http://127.0.0.1:8000/api/exams/send-exam/')
    print(f'Send Exam API OPTIONS Status: {response.status_code}')
    print(f'Send Exam API Headers: {dict(response.headers)}')
except Exception as e:
    print(f'Send Exam API Error: {e}')