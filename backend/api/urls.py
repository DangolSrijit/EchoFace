from django.contrib import admin
from django.urls import path
from .views import signup  # Import your view function

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    # TokenObtainPairView,
)


urlpatterns = [
    path('signup/', signup, name='signup'),  # URL for user registration
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # URL for token refresh
]