from django.urls import path
from .views import get_courses, add_course, update_course

urlpatterns = [
    path("", get_courses, name="get_courses"),
    path("add/", add_course, name="add_course"),
    path("update/<int:id>/", update_course, name="update_course"),
]