from django.urls import path
from .views import (send_exam_mail, 
                    exam_questions, 
                    submit_exam, 
                    completed_tests, 
                    delete_completed_test,)

urlpatterns = [
    path("send-exam/", send_exam_mail, name="send-exam"),
    path("questions/<str:course_title>/", exam_questions, name="exam-questions"),
    path("submit-exam/", submit_exam, name="submit-exam"),
    path("completed-tests/", completed_tests, name="completed-tests"),
    path("completed-tests/<int:pk>/delete/", delete_completed_test, name="delete-completed-test"),


]