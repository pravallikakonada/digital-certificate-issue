from django.urls import path
from .views import (
    send_exam_mail,
    exam_questions,
    submit_exam,
    completed_tests,
    delete_completed_test,
)

urlpatterns = [
    path("send-exam/", send_exam_mail),
    path("questions/<str:course_title>/", exam_questions),
    path("submit-exam/", submit_exam),
    path("completed-tests/", completed_tests),

    # 🔥 THIS IS MISSING IN YOUR DEPLOY
    path("completed-tests/<int:pk>/delete/", delete_completed_test),
]