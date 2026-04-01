from django.db import models


class ExamInvitation(models.Model):
    student_name = models.CharField(max_length=200)
    student_email = models.EmailField()
    course_title = models.CharField(max_length=200)
    exam_link = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=50, default="Pending")

    def __str__(self):
        return f"{self.student_name} - {self.course_title}"


class Question(models.Model):
    course_title = models.CharField(max_length=200)
    question_text = models.TextField()
    option1 = models.CharField(max_length=255)
    option2 = models.CharField(max_length=255)
    option3 = models.CharField(max_length=255)
    option4 = models.CharField(max_length=255)
    correct_answer = models.CharField(max_length=255)

    def __str__(self):
        return self.question_text


class ExamSubmission(models.Model):
    student_name = models.CharField(max_length=200)
    student_email = models.EmailField()
    course_title = models.CharField(max_length=200)
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    result = models.CharField(max_length=50, default="Failed")
    eligible_for_certificate = models.BooleanField(default=False)
    status = models.CharField(max_length=50, default="Completed")

    def __str__(self):
        return f"{self.student_name} - {self.course_title} - {self.score}"