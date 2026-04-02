from django.urls import path
from .views import course_list_create, course_detail

urlpatterns = [
    path("", course_list_create, name="course-list-create"),
    path("<int:pk>/", course_detail, name="course-detail"),
]