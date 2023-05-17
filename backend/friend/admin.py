from django.contrib import admin
from .models import FriendList, FriendRequest, BlockedList

admin.site.register(FriendList)
admin.site.register(FriendRequest)
admin.site.register(BlockedList)
# Register your models here.
