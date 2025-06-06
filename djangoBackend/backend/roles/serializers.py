from rest_framework import serializers
from .models import Role, Permission, GroupUserRole
from groups.models import Group

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'code', 'description']

class RoleSerializer(serializers.ModelSerializer):
    group = serializers.StringRelatedField()  # or use a GroupSerializer
    permissions = PermissionSerializer(many=True)

    class Meta:
        model = Role
        fields = ['id', 'name', 'group', 'permissions']
class RoleSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']

class GroupSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class GroupUserRoleSerializer(serializers.ModelSerializer):
    group = GroupSummarySerializer()
    role = RoleSummarySerializer()

    class Meta:
        model = GroupUserRole
        fields = ['group', 'role']

