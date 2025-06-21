from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self, student_id, email, name, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not student_id:
            raise ValueError("Users must have a student ID")
        
        email = self.normalize_email(email)
        user = self.model(
            student_id=student_id,
            email=email,
            name=name
        )
        
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, student_id, email, name, password=None):
        user = self.create_user(
            student_id=student_id,
            email=email,
            name=name,
            password=password
        )
        user.is_staff = True
        # user.is_active = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
    

class User(AbstractBaseUser, PermissionsMixin):
    student_id= models.CharField(max_length=20, unique=True, null=False, blank=False)
    email= models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    # last_name = models.CharField(max_length=100)
    created_at= models.DateTimeField(auto_now_add=True)
    updated_at= models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS= ['student_id', 'name']

    objects = UserManager()

    def __str__(self):
        return self.email


class Attendance(models.Model):
    student_name = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    date = models.DateField( default=timezone.now)

    def __str__(self):
        return f"{self.student_name} - {self.date} {self.timestamp}"
