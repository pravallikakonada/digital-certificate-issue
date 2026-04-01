from django.urls import path
from .views import (
    exam_invitation_list_create,
    question_list_by_course,
    submit_exam,
    completed_tests,
)

urlpatterns = [
    path("send-exam-mail/", exam_invitation_list_create, name="send_exam_mail"),
    path("questions/", question_list_by_course, name="question_list_by_course"),
    path("submit-exam/", submit_exam, name="submit_exam"),
    path("completed-tests/", completed_tests, name="completed_tests"),
]