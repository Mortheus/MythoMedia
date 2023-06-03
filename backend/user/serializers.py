import datetime

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import EmailMessage
from django.contrib.auth.hashers import check_password
from rest_framework.settings import api_settings

from .token import TokenGenerator, account_activation_token, account_password_reset_token

from .models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
import re
from .enums import Gender
from datetime import date, timedelta


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "username", "bio", "is_active", "is_support", 'profile_picture', 'is_private']


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
            email = validated_data['email'],

        )
        user.set_password(validated_data['password'])

        user.save()
        token = account_activation_token.make_token(user)
        mail_subject = 'Activaiton link has been sent to your email id'
        message = render_to_string('AccountActivation.html', {
            'user': user,
            'domain': "127.0.0.1:8000",
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': token,

        })
        print(token)
        to_email = validated_data['email']
        email = EmailMessage(mail_subject, message, to=[to_email])
        email.send()
        return user


class LoginUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    class Meta:
        model = User
        fields = ['email', 'password']


class PasswordResetSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password_error": "Password Fields didn't match."})
        return attrs
    def update(self, instance, validated_data):
        print(instance.password, validated_data['password'])
        if check_password(validated_data['password'], instance.password):
            raise serializers.ValidationError({"password_error": "The password is the same as the old one."})
        instance.set_password(validated_data['password'])
        instance.save()


class InitiateResetPasswordSerializer(serializers.ModelSerializer):
    initiate = serializers.BooleanField()
    email = serializers.EmailField(required=True)
    class Meta:
        model = User
        fields = ['email', 'initiate']

    def send_email(self, email):
        user = User.objects.get(email=email)
        token = account_password_reset_token.make_token(user)
        mail_subject = 'Reset password link has been sent to your email.'
        message = render_to_string('PasswordReset.html', {
            'user': user,
            'domain': "127.0.0.1:8000",
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': token,

        })
        to_email = email
        mail = EmailMessage(mail_subject, message, to=[to_email])
        mail.send()


class UpdateProfileSerializer(serializers.ModelSerializer):
    # birthdate = serializers.DateField(format=api_settings.DATE_FORMAT, input_formats=None, required=False, allow_null=True)
    birthdate = serializers.CharField(max_length=255, allow_blank=True, allow_null=True)
    gender = serializers.ChoiceField(choices=Gender.choices, required=False, allow_blank=True)
    profile_picture = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
    is_private = serializers.BooleanField(default=False, allow_null=True, required=False)

    class Meta:
        model = User
        fields = ['bio', 'birthdate', 'gender', 'profile_picture', 'is_private']

    # def validate_birthdate(self, value):
    #     if not value:
    #         return value
    #     print(value > date.today() + timedelta(days=1))
    #     if value > date.today() + timedelta(days=1):
    #         raise serializers.ValidationError({'error': 'The date entered is not valid'})
    #
    #     return value

    def update(self, instance, validated_data):
        user = User.objects.get(email=instance)
        if validated_data.get('profile_picture') is None:
            fields_to_update = ['bio', 'gender', 'is_private']
        else:
            fields_to_update = ['bio', 'gender', 'profile_picture', 'is_private']
        birthdate_list = validated_data.get('birthdate').split("-")
        for field in fields_to_update:
            setattr(instance, field, validated_data.get(field))
        if len(birthdate_list) == 3:
            birthdate = date(int(birthdate_list[0]), int(birthdate_list[1]), int(birthdate_list[2]))
            instance.birthdate = birthdate
            instance.save(update_fields=fields_to_update + ['birthdate'])
            return
        instance.save(update_fields=fields_to_update)



class GetUserDetailSerializer(serializers.ModelSerializer):
    number_of_posts = serializers.SerializerMethodField()
    number_of_friends = serializers.SerializerMethodField()

    def get_number_of_posts(self, user):
        return user.post_set.count()

    def get_number_of_friends(self, user):
        return user.friendlist.friends.count()

    class Meta:
        model = User
        fields = ['username', 'email', 'bio', 'gender', 'profile_picture', 'number_of_posts', 'number_of_friends', 'is_private']


class FriendDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'bio', 'profile_picture']

