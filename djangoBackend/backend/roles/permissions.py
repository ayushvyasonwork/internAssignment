from rest_framework.permissions import BasePermission
from .models import GroupUserRole
from rest_framework import permissions
from groups.models import GroupMembership

class HasGroupPermission(BasePermission):
    def has_permission(self, request, view):
        group_id = request.data.get('group') or request.query_params.get('group')
        user = request.user

        print(f"▶️ Checking group permission: user={user}, group_id={group_id}")

        if not group_id or not user.is_authenticated:
            print("❌ No group_id or user not authenticated")
            return False

        has_permission = GroupUserRole.objects.filter(user=user, group_id=group_id).exists()
        print(f"✅ Has role in group: {has_permission}")
        return has_permission
class IsOrgAdmin(permissions.BasePermission):
    """
    Custom permission to allow only organization admins to create permissions.
    """

    def has_permission(self, request, view):
        user = request.user
        print(f"Checking IsOrgAdmin: Authenticated={user.is_authenticated}, IsOrgAdmin={getattr(user, 'is_org_admin', False)}")
        return bool(user and user.is_authenticated and getattr(user, 'is_org_admin', False))
    
class IsGroupMember(BasePermission):
    """
    Allows access only to authenticated users who are members of the group.
    """

    def has_permission(self, request, view):
        group_id = request.data.get('group') or request.query_params.get('group')
        user = request.user

        if not user.is_authenticated or not group_id:
            return False

        return GroupMembership.objects.filter(group_id=group_id, user=user).exists()