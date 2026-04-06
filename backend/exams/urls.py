from django.urls import path
from .views import send_exam_mail, send_exam_mail_bulk, completed_tests, submit_exam, update_exam_status, get_questions

urlpatterns = [
    path("send-exam/", send_exam_mail, name="send-exam"),
    path("send-exam-bulk/", send_exam_mail_bulk, name="send-exam-bulk"),
    path("completed-tests/", completed_tests, name="completed-tests"),
    path("submit-exam/", submit_exam, name="submit-exam"),
    path("update-status/", update_exam_status, name="update-exam-status"),
    path("questions/<str:course_title>/", get_questions, name="get-questions"),
]