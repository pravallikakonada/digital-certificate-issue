from django.urls import path
from .views import issue_certificate, verify_certificate, certificate_list

urlpatterns = [
    path("", certificate_list, name="certificate_list"),
    path("issue/", issue_certificate, name="issue_certificate"),
    path("verify/<str:certificate_id>/", verify_certificate, name="verify_certificate"),
]