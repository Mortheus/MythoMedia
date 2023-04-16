from .views import ListUsersView, RegisterUserView
from django.urls import path


urlpatterns = [
    path("", ListUsersView.as_view()),
    path("register", RegisterUserView.as_view())
]