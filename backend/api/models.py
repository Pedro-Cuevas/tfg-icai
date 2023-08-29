from django.db import models
from django.contrib.auth.models import User


class UserHash(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    hash_value = models.CharField(max_length=256)
    description = models.TextField(
        blank=True, null=True
    )  # Optional description of the hash

    class Meta:
        unique_together = ("user", "hash_value")
