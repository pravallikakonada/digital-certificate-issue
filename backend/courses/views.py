from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Course, FinalProject


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


@api_view(["GET", "POST"])
def final_project_list_create(request):
    if request.method == "GET":
        projects = FinalProject.objects.all().order_by("-created_at")
        data = []
        for project in projects:
            data.append({
                "id": project.id,
                "course": {
                    "id": project.course.id,
                    "title": project.course.title,
                },
                "title": project.title,
                "description": project.description,
                "requirements": project.requirements,
                "deadline": project.deadline,
                "created_at": project.created_at,
            })
        return Response(data)

    if request.method == "POST":
        course_id = request.data.get("course_id")
        title = request.data.get("title")
        description = request.data.get("description")
        requirements = request.data.get("requirements")
        deadline = request.data.get("deadline")

        if not course_id or not title:
            return Response(
                {"error": "Course ID and title are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            course = Course.objects.get(pk=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        project = FinalProject.objects.create(
            course=course,
            title=title,
            description=description or "",
            requirements=requirements or "",
            deadline=deadline,
        )

        return Response(
            {
                "id": project.id,
                "course": {
                    "id": project.course.id,
                    "title": project.course.title,
                },
                "title": project.title,
                "description": project.description,
                "requirements": project.requirements,
                "deadline": project.deadline,
                "created_at": project.created_at,
            },
            status=status.HTTP_201_CREATED
        )


@api_view(["GET", "PUT", "DELETE"])
def final_project_detail(request, pk):
    try:
        project = FinalProject.objects.get(pk=pk)
    except FinalProject.DoesNotExist:
        return Response(
            {"error": "Final project not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        return Response({
            "id": project.id,
            "course": {
                "id": project.course.id,
                "title": project.course.title,
            },
            "title": project.title,
            "description": project.description,
            "requirements": project.requirements,
            "deadline": project.deadline,
            "created_at": project.created_at,
        })

    if request.method == "PUT":
        course_id = request.data.get("course_id")
        if course_id:
            try:
                course = Course.objects.get(pk=course_id)
                project.course = course
            except Course.DoesNotExist:
                return Response(
                    {"error": "Course not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

        project.title = request.data.get("title", project.title)
        project.description = request.data.get("description", project.description)
        project.requirements = request.data.get("requirements", project.requirements)
        project.deadline = request.data.get("deadline", project.deadline)
        project.save()

        return Response({
            "id": project.id,
            "course": {
                "id": project.course.id,
                "title": project.course.title,
            },
            "title": project.title,
            "description": project.description,
            "requirements": project.requirements,
            "deadline": project.deadline,
            "created_at": project.created_at,
        })

    if request.method == "DELETE":
        project.delete()
        return Response({"message": "Final project deleted successfully"})