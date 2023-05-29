from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from backend.friend.views import ShowFriendsView, ShowFriendRequestsView, SendFriendRequestView, \
    HandleFriendRequestView, GetSuggestedFriendsView, GetBlockedUsers, BlockUser, UnblockUser, FullBlock, GetFriends

urlpatterns = [
    path("", ShowFriendsView.as_view()),
    path("/requests", ShowFriendRequestsView.as_view()),
    path("/add-friend/<str:username>", SendFriendRequestView.as_view()),
    path("/request/<str:username>", HandleFriendRequestView.as_view()),
    path("/suggestions", GetSuggestedFriendsView.as_view()),
    path("/blocked_users", GetBlockedUsers.as_view()),
    path("/friends/<int:user_ID>", GetFriends.as_view()),
    path("/block_user/<str:username>", BlockUser.as_view()),
    path("/unblock_user/<str:username>", UnblockUser.as_view()),
    path("/full_block/<str:username>", FullBlock.as_view()),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)