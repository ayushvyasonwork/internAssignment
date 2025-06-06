from rest_framework import serializers
from .models import Group, GroupMembership
from accounts.models import User
from roles.models import GroupUserRole

class GroupSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = Group
        fields = ['id', 'name', 'owner', 'created_at']

class GroupMembershipSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    group = serializers.StringRelatedField()

    class Meta:
        model = GroupMembership
        fields = ['id', 'group', 'user', 'joined_at']

class GroupMemberWithRoleSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role']

    def get_role(self, user):
        group = self.context.get('group')
        if not group:
            return None

        # First check explicit group role
        group_user_role = GroupUserRole.objects.filter(user=user, group=group).first()
        if group_user_role:
            return group_user_role.role.name

        # Then check if they are the group owner
        if user == group.owner:
            return 'Owner'

        # Then check membership
        if GroupMembership.objects.filter(user=user, group=group).exists():
            return 'Member'

        # Fallback
        return 'Unknown'
