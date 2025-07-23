from django.contrib import admin
from django.urls import path
from .views import (
    signup,
    login,
    logout_view, 
    capture_faces,  
    get_faces_data,
    recognize_faces,
    video_feed,
    evaluate_model_view,
    create_room,  # Import the new view for room creation
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
    path('capture_faces/', capture_faces, name='capture_faces'),  # URL for face capture
    path('get_faces_data/', get_faces_data, name='get_faces_data'),  # URL for getting face data
    path('recognize_faces/', recognize_faces, name='recognize_faces'),  # URL for face recognition
    path('video_feed/', video_feed, name='video_feed'),  # URL for video feed
    path('evaluate_model/', evaluate_model_view, name='evaluate_model'),  # URL for model evaluation
    path('api/create-room/', create_room, name='create_room'),
 ]