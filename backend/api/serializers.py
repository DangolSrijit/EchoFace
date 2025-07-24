from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('student_id', 'email', 'name')


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError("Email and password are required")

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")
        
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")

        attrs['user'] = user
        return attrs
    

class RegisterSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField(required=False, allow_null=True)
    role = serializers.CharField(required=False)  # add role here

    class Meta:
        model = User
        fields = ("student_id", "email", "name", "password", "role")
        extra_kwargs = {
            "password": {"write_only": True},
            "student_id": {"required": False, "allow_null": True},
            "role": {"required": False}
        }

    def create(self, validated_data):
        role = validated_data.pop('role', 'participant')
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)

        # Set is_staff or other flags based on role
        if role == 'admin':
            user.is_staff = True
            user.is_superuser = True  # optionally, if admin has superuser rights

        else:
            user.is_staff = False
            user.is_superuser = False

        user.save()
        return user


# class RegisterSerializer(serializers.ModelSerializer):
#     password1 = serializers.CharField(write_only=True, required=True)
#     password2 = serializers.CharField(write_only=True, required=True)

#     class Meta:
#         model = User
#         fields = ('student_id', 'email', 'name', 'password1', 'password2')
#         extra_kwargs = {
#             'password1': {'write_only': True},
#             'password2': {'write_only': True}
#         }
    
#     def validate(self, attrs):
#         if attrs['password1'] != attrs['password2']:
#             raise serializers.ValidationError("Passwords do not match")
        
#         email = attrs.get("email", "")
#         if User.objects.filter(email=email).exists():
#             raise serializers.ValidationError({"email": "Email is already in use"})

#         return attrs

#     def create(self, validated_data):
#         # Remove password2 (not needed for user creation)
#         password = validated_data.pop('password1')
#         validated_data.pop('password2')

#         # Create user and hash password
#         user = User(**validated_data)
#         user.set_password(password)
#         user.save()
#         return user
#         # return User.objects.create_user(**validated_data)

class RegisterSerializer(serializers.ModelSerializer):
    student_id = serializers.CharField(required=False, allow_null=True)
    role = serializers.CharField(required=False, default='participant')

    class Meta:
        model = User
        fields = ("student_id", "email", "name", "password", "role")
        extra_kwargs = {
            "password": {"write_only": True},
            "student_id": {"required": False, "allow_null": True},
            "role": {"required": False}
        }

    def create(self, validated_data):
        role = validated_data.pop('role', 'participant')
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)

        if role == 'admin':
            user.is_staff = True
            user.is_superuser = True  # if you want admins to have superuser rights
        else:
            user.is_staff = False
            user.is_superuser = False

        user.save()
        return user


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'


class RegisteredUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'is_staff', 'created_at', 'is_active']

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'
        