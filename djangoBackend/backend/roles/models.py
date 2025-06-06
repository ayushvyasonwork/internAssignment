from django.db import models
from groups.models import Group  # assuming your groups app is named `groups`
from django.contrib.auth import get_user_model
from groups.models import Group 
User = get_user_model()
# Create your models here.
class Permission(models.Model):
    code = models.CharField(max_length=50, unique=True)  # e.g., 'MANAGE_MEMBERS'
    description = models.TextField(blank=True)
    def __str__(self):
        return self.code


class Role(models.Model):
    name = models.CharField(max_length=50)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='roles')
    permissions = models.ManyToManyField(Permission, blank=True)
    priority = models.IntegerField(default=0)  # or any sensible default
    # Add this for inheritance
    inherited_roles = models.ManyToManyField("self", blank=True, symmetrical=False) 

    def get_all_permissions(self):
        # Include inherited permissions
        perms = set(self.permissions.all())
        for inherited in self.inherited_roles.all():
            perms.update(inherited.get_all_permissions())
        return perms

    def __str__(self):
        return f"{self.name} ({self.group.name})"



class GroupUserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'group', 'role')