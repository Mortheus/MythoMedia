from django.urls import path
from .views import CreateGroupChatView, CreatePersonalChatView, RemoveMemberToGroupView, AddMemberToGroupView, \
    SearchGroupView, ConversationHistory, AddMessageToGroup, EditGroup, GetChatsView, GetMembersView, LeaveGroupChat, \
    GetChatDetails

urlpatterns = [
    path('create-group', CreateGroupChatView.as_view()),
    path('create-personal/<str:username>', CreatePersonalChatView.as_view()),
    path('add/<str:group_ID>/<str:username>', AddMemberToGroupView.as_view()),
    path('remove/<str:group_ID>/<str:username>', RemoveMemberToGroupView.as_view()),
    path('search/<str:query_name>', SearchGroupView.as_view()),
    path('add-message/<str:group_id>', AddMessageToGroup.as_view()),
    path('conversation-history/<str:group_id>', ConversationHistory.as_view()),
    path('edit/<str:group_ID>', EditGroup.as_view()),
    path('', GetChatsView.as_view()),
    path('members/<str:group_ID>', GetMembersView.as_view()),
    path('leave/<str:group_ID>', LeaveGroupChat.as_view()),
    path('view-details/<str:group_ID>', GetChatDetails.as_view()),

]