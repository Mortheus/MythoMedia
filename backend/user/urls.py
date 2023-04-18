from .views import ListUsersView, RegisterUserView, LoginUserView, ActivationMailView, PasswordResetView, \
    ActivationMailView, InitiateResetPasswordView, UpdateProfileView, GetUserDetailView
from django.urls import path, include
from rest_framework.authtoken.views import ObtainAuthToken

urlpatterns = [
    path("", ListUsersView.as_view()),
    path("register", RegisterUserView.as_view()),
    path('api-token-auth', ObtainAuthToken.as_view()),
    path('login', LoginUserView.as_view()),
    path('initiate-password-reset', InitiateResetPasswordView.as_view()),
    path('activate-email/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/', ActivationMailView.as_view(), name='activate'),
    path('reset-password-email/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/', PasswordResetView.as_view(), name='reset_password'),
    path('update-profile', UpdateProfileView.as_view()),
    path('api-auth/', include('rest_framework.urls')),
    path('user/', GetUserDetailView.as_view())
]