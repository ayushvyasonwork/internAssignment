from .models import Permission

def assign_permissions_based_on_role(role):
    if role.name == "Owner":
        return Permission.objects.all()
    elif role.name == "Admin":
        return Permission.objects.exclude(code="MODIFY_OWNER")
    elif role.name == "Member":
        return Permission.objects.filter(code="VIEW_GROUP_INFO")
    return Permission.objects.none()
