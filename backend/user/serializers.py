from django.contrib.auth.password_validation import validate_password

from .models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
import re


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "bio", "is_active", "is_support"]


class RegisterUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ["email", "username", "password", "password2"]

    def validate_email(self, value):
        pattern = r"^\S+@\S+\.\S+$"
        result = re.search(pattern, value)
        if result is None:
            raise serializers.ValidationError({"email_error": "It's not a valid email."})
        return value

    def validate_password(self, value):
        pattern = r"(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
        result = re.search(pattern, value)
        if result is None:
            raise serializers.ValidationError({"password_error": "Not a strong password."})
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password_error": "Password Fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username = validated_data['username'],
            email = validated_data['username'],

        )
        user.set_password(validated_data['password'])
        print(user.password)
        user.save()

        return user
