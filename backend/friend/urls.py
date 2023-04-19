from django.urls import path

from backend.friend.views import ShowFriendsView

urlpatterns = [
    path("", ShowFriendsView.as_view())
]