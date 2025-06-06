from rest_framework import generics,permissions
from .serializers import RegisterSerializer,UserSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "You are authenticated", "user": request.user.email})

class DebugAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("Authenticated user:", request.user)
        print("Is org admin:", getattr(request.user, 'is_org_admin', 'N/A'))
        return Response({
            "user": str(request.user),
            "is_org_admin": getattr(request.user, 'is_org_admin', False)
        })


# In views.py

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        email = self.request.query_params.get('email')
        if email:
            queryset = queryset.filter(email=email)
        return queryset
