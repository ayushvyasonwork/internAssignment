from django.urls import path
from .views import RegisterView, ProtectedView,DebugAuthView,UserListView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', ProtectedView.as_view(), name='protected'),
     path('debug-auth/', DebugAuthView.as_view(), name='debug-auth'),
     path('all-users/', UserListView.as_view(), name='all-users'),
]