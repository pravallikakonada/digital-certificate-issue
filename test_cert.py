import http.client
import json

conn = http.client.HTTPConnection('127.0.0.1', 8000)
data = json.dumps({
    'student_name': 'Test User',
    'student_email': 'test@example.com',
    'course_title': 'Test Course',
    'certificate_id': 'CERT-1234',
    'status': 'Issued'
})

headers = {'Content-Type': 'application/json'}

try:
    conn.request('POST', '/api/certificates/issue/', data, headers)
    response = conn.getresponse()
    print('Status:', response.status)
    print('Response:', response.read().decode())
except Exception as e:
    print('Error:', e)
finally:
    conn.close()