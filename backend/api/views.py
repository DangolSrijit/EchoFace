from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import * # Make sure this matches your serializer name
from rest_framework_simplejwt.tokens import RefreshToken
# from .tokens import get_tokens_for_user  # You need to define this (see below)



def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


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

# Create your views here.
