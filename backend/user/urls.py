from .views import ListUsersView, RegisterUserView, LoginUserView
from django.urls import path
from rest_framework.authtoken.views import ObtainAuthToken

urlpatterns = [
    path("", ListUsersView.as_view()),
    path("register", RegisterUserView.as_view()),
    path('api-token-auth', ObtainAuthToken.as_view()),
    path('login', LoginUserView.as_view())
]