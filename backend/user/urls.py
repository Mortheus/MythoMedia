from .views import ListUsersView, RegisterUserView, LoginUserView, ActivationMailView, PasswordResetView, \
    ActivationMailView, InitiateResetPasswordView, UpdateProfileView, GetUserDetailView, GetUserFriendListView, \
    ViewProfilePicture, DecodeTokenUser, ViewPostPicture, GetAUserDetailView
from django.urls import path, include
from rest_framework.authtoken.views import ObtainAuthToken
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
                  path("get-users", ListUsersView.as_view()),
                  path("register", RegisterUserView.as_view()),
                  path('api-token-auth', ObtainAuthToken.as_view()),
                  path('login', LoginUserView.as_view()),
                  path('loggin', jwt_views.TokenObtainPairView.as_view()),
                  path('refresh', jwt_views.TokenRefreshView.as_view()),
                  path('token/refresh/', jwt_views.TokenRefreshView.as_view()),
                  path('initiate-password-reset', InitiateResetPasswordView.as_view()),
                  path('activate-email/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/',
                       ActivationMailView.as_view(), name='activate'),
                  path('reset-password-email/<str:uidb64>/<str:token>/',
                      PasswordResetView.as_view()),
                  path('update-profile', UpdateProfileView.as_view()),
                  path('api-auth/', include('rest_framework.urls')),
                  path('user/<int:userID>', GetUserDetailView.as_view()),
                  path('auser/<str:username>', GetAUserDetailView.as_view()),
                  path('user/decode', DecodeTokenUser.as_view()),
                  path('user/friends', GetUserFriendListView.as_view()),
                  path('media/profile_pics/<str:filename>', ViewProfilePicture.as_view()),
                  path('media/post_images/<str:filename>', ViewPostPicture.as_view())
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
