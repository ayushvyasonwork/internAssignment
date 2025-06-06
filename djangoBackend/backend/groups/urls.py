from django.urls import path
from .views import (
    GroupListCreateView,
    GroupMembershipListView,
    JoinGroupView,
    GroupMembersByGroupView,RemoveGroupMemberView,ApproveJoinRequestView
)

urlpatterns = [
    path('', GroupListCreateView.as_view(), name='group-list-create'),
    path('memberships/', GroupMembershipListView.as_view(), name='group-memberships'),
    path('<int:group_id>/join/', JoinGroupView.as_view(), name='join-group'),
    path('<int:group_id>/members/', GroupMembersByGroupView.as_view(), name='group-members-by-id'),
     path('<int:group_id>/remove-member/<int:user_id>/', RemoveGroupMemberView.as_view(), name='remove-group-member'),
     path('<int:group_id>/approve/<int:user_id>/', ApproveJoinRequestView.as_view(), name='approve-join-request'),
]