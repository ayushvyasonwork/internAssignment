from rest_framework import viewsets, generics, permissions
from .models import Role, Permission, GroupUserRole
from .serializers import RoleSerializer, PermissionSerializer, GroupUserRoleSerializer
from .permissions import HasGroupPermission, IsOrgAdmin, IsGroupMember
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from .utils import assign_permissions_based_on_role

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsOrgAdmin]

    def perform_create(self, serializer):
        role = serializer.save()
        permissions = assign_permissions_based_on_role(role)
        role.permissions.set(permissions)


class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsOrgAdmin]


class GroupUserRoleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = GroupUserRoleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return GroupUserRole.objects.filter(user=self.request.user)


class CreatePermissionView(generics.CreateAPIView):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [IsOrgAdmin]  # <- only org admins allowed

    def post(self, request, *args, **kwargs):
        print("▶️ CreatePermissionView POST called")
        return super().post(request, *args, **kwargs)
