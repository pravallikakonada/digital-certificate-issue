from django.urls import path
from .views import send_exam_mail, exam_questions, submit_exam, completed_tests

urlpatterns = [
    path("send-exam/", send_exam_mail, name="send-exam"),
    path("questions/<str:course_title>/", exam_questions, name="exam-questions"),
    path("submit-exam/", submit_exam, name="submit-exam"),
    path("completed-tests/", completed_tests, name="completed-tests"),
]