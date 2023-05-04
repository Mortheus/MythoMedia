from django.urls import path

from backend.friend.views import ShowFriendsView, ShowFriendRequestsView, SendFriendRequestView, \
    HandleFriendRequestView, GetSuggestedFriendsView

urlpatterns = [
    path("", ShowFriendsView.as_view()),
    path("/requests", ShowFriendRequestsView.as_view()),
    path("/add-friend", SendFriendRequestView.as_view()),
    path("/request/<str:username>", HandleFriendRequestView.as_view()),
    path("/suggestions", GetSuggestedFriendsView.as_view()),

]