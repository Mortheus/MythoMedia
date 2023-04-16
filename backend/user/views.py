from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import render
from django.utils.http import urlsafe_base64_decode
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from backend.user.serializers import UserSerializer, RegisterUserSerializer, LoginUserSerializer, PasswordResetSerializer, InitiateResetPasswordSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.conf import settings
from .token import account_activation_token, account_password_reset_token



# Create your views here.
class ListUsersView(APIView):
    serializer_class = UserSerializer

    def get(self, request, format=None):
        users = User.objects.all()
        serializer = self.serializer_class(users, many=True)
        return JsonResponse(serializer.data, safe=False)


class RegisterUserView(APIView):
    serializer_class = RegisterUserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.create(request.data)
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response({"Register Failed": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class LoginUserView(APIView):
    serializer_class = LoginUserSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get('email')
            password = serializer.validated_data.get('password')
            user = authenticate(request, email=email, password=password)
            print(user)
            if user is not None:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_200_OK)
            else:
                return Response({'User not found': 'Invalid credentials'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ActivationMailView(APIView):
    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user.email and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save(update_fields=['is_active'])
            return Response({'message': 'Account activated successfully. You can now login in!'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Activation link is invalid.'}, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    serializer_class = PasswordResetSerializer
    def post(self, request, uidb64, token):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                uid = urlsafe_base64_decode(uidb64).decode()
                user = User.objects.get(pk=uid)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                user = None

            if user and account_password_reset_token.check_token(user, token):
                serializer.update(user, serializer.validated_data)
                print(user.password)
                return Response({'msg': 'Changed Password Successfully'}, status=status.HTTP_200_OK)

            return Response({'error': 'Could not update the password'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)




class InitiateResetPasswordView(APIView):
    serializer_class = InitiateResetPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        print(request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            if serializer.validated_data['initiate']:
                serializer.send_email(serializer.validated_data['email'])
                return Response({"msg": "Email sent successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "User didn't select the option"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Response': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

