from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    is_org_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.email
