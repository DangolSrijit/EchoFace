from django.contrib import admin
from django.urls import path
from .views import (
    signup,
    login,
    logout_view, 
    capture_faces,  
    get_faces_data,
    delete_face_data,
    recognize_faces,
    get_user_count,
    video_feed,
    evaluate_model_view,
    create_room, 
    registered_users,
    delete_user, 
    get_attendance,
    get_rooms,
    total_recognized_faces,
    get_total_rooms,
    recent_logs,
    get_csrf_cookie,
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
    path('delete_face_data/', delete_face_data, name='delete_face_data'),  # URL for deleting face data
    path('recognize_faces/', recognize_faces, name='recognize_faces'),  # URL for face recognition
    path('video_feed/', video_feed, name='video_feed'),  # URL for video feed
    path('evaluate_model/', evaluate_model_view, name='evaluate_model'),  # URL for model evaluation
    path('api/create-room/', create_room, name='create_room'),
    path('api/user-count/', get_user_count),
    path('api/registered-users/', registered_users, name='registered-users'),
    path('api/delete-user/<int:pk>/', delete_user, name='delete_user'),
    path('attendance/', get_attendance, name='get_attendance'),
    path('rooms/', get_rooms, name='get_rooms'),
    path('api/total-recognized-faces/', total_recognized_faces, name='total_recognized_faces'),
    path('api/total-rooms/', get_total_rooms, name='total_rooms'),
    path('api/recent-logs/', recent_logs),
    path('api/get-csrf-cookie/', get_csrf_cookie, name='get_csrf_cookie'),
 ]