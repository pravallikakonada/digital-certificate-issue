from django.urls import path
from .views import send_exam_mail, send_exam_mail_bulk, completed_tests, submit_exam, update_exam_status, get_questions, create_question, update_question, delete_question, test_email_config

urlpatterns = [
    path("send-exam/", send_exam_mail, name="send-exam"),
    path("send-exam-bulk/", send_exam_mail_bulk, name="send-exam-bulk"),
    path("completed-tests/", completed_tests, name="completed-tests"),
    path("submit-exam/", submit_exam, name="submit-exam"),
    path("update-status/", update_exam_status, name="update-exam-status"),
    path("questions/", create_question, name="create-question"),
    path("questions/<int:question_id>/", update_question, name="update-question"),
    path("questions/<int:question_id>/delete/", delete_question, name="delete-question"),
    path("questions/<str:course_title>/", get_questions, name="get-questions"),
    path("test-email-config/", test_email_config, name="test-email-config"),
]