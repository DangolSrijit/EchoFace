from django.contrib import admin
from django.urls import path
from .views import (
    signup,
    login,
    logout_view,  # Ensure you have a logout view implemented
)  # Import your view function

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    # TokenObtainPairView,
)


urlpatterns = [
    path('signup/', signup, name='signup'),  # URL for user registration
    path('login/', login, name='login'),  # URL for user login
    path('logout/', logout_view, name='logout'),  # URL for user logout
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # URL for token refresh
]