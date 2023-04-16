from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from backend.user.serializers import UserSerializer, RegisterUserSerializer


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

