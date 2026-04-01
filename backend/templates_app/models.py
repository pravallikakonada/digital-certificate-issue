from django.db import models
from courses.models import Course

class CertificateTemplate(models.Model):
    template_name = models.CharField(max_length=200)
    header_title = models.CharField(max_length=255, default="Certificate of Completion")
    sub_text = models.CharField(max_length=255, blank=True, null=True)
    signature_name = models.CharField(max_length=150, blank=True, null=True)
    signature_role = models.CharField(max_length=150, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.template_name


class CourseTemplateMap(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE)
    template = models.ForeignKey(CertificateTemplate, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.course.title} -> {self.template.template_name}"