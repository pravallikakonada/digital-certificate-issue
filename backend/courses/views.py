from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Course


@api_view(["GET", "POST"])
def course_list_create(request):
    if request.method == "GET":
        courses = Course.objects.all().order_by("id")
        data = []
        for course in courses:
            data.append({
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "created_at": course.created_at,
            })
        return Response(data)

    if request.method == "POST":
        title = request.data.get("title")
        description = request.data.get("description")

        if not title:
            return Response(
                {"error": "Title is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        course = Course.objects.create(
            title=title,
            description=description or ""
        )

        return Response(
            {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "created_at": course.created_at,
            },
            status=status.HTTP_201_CREATED
        )


@api_view(["GET", "PUT", "DELETE"])
def course_detail(request, pk):
    try:
        course = Course.objects.get(pk=pk)
    except Course.DoesNotExist:
        return Response(
            {"error": "Course not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        return Response({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "created_at": course.created_at,
        })

    if request.method == "PUT":
        course.title = request.data.get("title", course.title)
        course.description = request.data.get("description", course.description)
        course.save()

        return Response({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "created_at": course.created_at,
        })

    if request.method == "DELETE":
        course.delete()
        return Response({"message": "Course deleted successfully"})