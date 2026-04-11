from django.db import models


class Certificate(models.Model):
    student_name = models.CharField(max_length=200)
    student_email = models.EmailField()
    course_title = models.CharField(max_length=200)
    certificate_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=50, default="Issued")
    template = models.CharField(max_length=20, default="classic")

    def __str__(self):
        return self.certificate_id