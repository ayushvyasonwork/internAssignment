from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Group(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_groups')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class GroupMembership(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='group_memberships')
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('group', 'user')  # One user per group only once

    def __str__(self):
        return f"{self.user.email} in {self.group.name}"
