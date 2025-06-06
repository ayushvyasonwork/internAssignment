from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/groups/', include('groups.urls')),
    path('api/roles/', include('roles.urls')),
]
