from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import (
    LoginSerializer, 
    RegisterSerializer
) # Make sure this matches your serializer name
from rest_framework_simplejwt.tokens import RefreshToken
# from .tokens import get_tokens_for_user  # You need to define this (see below)


# Create your views here.

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)

        return Response(
            {"tokens": tokens, 
             "msg": "User login success",
             "user": {
                "student_id": user.student_id,
                "email": user.email,
                "name": user.name
                }
            }, status=status.HTTP_200_OK,)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response(
            {"tokens": tokens, "msg": "User registration success"},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"]) 
@permission_classes([AllowAny])
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response(
                {"msg": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST
            )
        
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(
            {"msg": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT
        )
    except Exception :
        return Response({"msg": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
