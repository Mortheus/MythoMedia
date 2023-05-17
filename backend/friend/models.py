from django.db import models
from django.conf import settings
from django.utils import timezone
from ..user.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class FriendList(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="friendlist")
    friends = models.ManyToManyField(User, blank=True, related_name="friends")

    def __str__(self):
        return self.user.username

    def add_friend(self, account):
        if not account in self.friends.all():
            self.friends.add(account)
            self.save()

    def remove_friend(self, account):
        if account in self.friends.all():
            self.friends.remove(account)


    def unfriend(self, removee):
        remover_friends_list = self
        remover_friends_list.remove_friend(removee)
        friends_list = FriendList.objects.get(user=removee)
        friends_list.remove_friend(self.user)


    def is_mutual_friend(self, friend):
        if friend in self.friends.all():
            return True
        return False


    def friend_suggestions(self):
        suggestions = {}
        users = User.objects.all()
        friends = self.friends.all()
        for friend in friends:
            for user in users:
                count = 0
                if user in friend.friends.all():
                    suggestions[user.username] += 1

        return suggestions




class FriendRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver")
    is_active = models.BooleanField(blank=True, null=False, default=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sender.username + "->" + self.receiver.username

    def accept(self):
        receiver_friend_list = FriendList.objects.get(user=self.receiver)
        if receiver_friend_list:
            receiver_friend_list.add_friend(self.sender)
            sender_friend_list = FriendList.objects.get(user=self.sender)
            if sender_friend_list:
                sender_friend_list.add_friend(self.receiver)
                self.is_active = False
                self.save()


    def decline(self):
        self.is_active = False
        self.save()


    def cancel(self):
        self.is_active = False
        self.save()


class BlockedList(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="block_list")
    blocked_users = models.ManyToManyField(User, blank=True, related_name="blocked_users")

    def __str__(self):
        return self.user.username + "'s block list"

    def block(self, account):
        if account not in self.blocked_users.all():
            self.blocked_users.add(account)
            self.save()

    def unblock(self, account: User):
        if account in self.blocked_users.all():
            self.blocked_users.remove(account)
            self.save()

        if self.user in account.block_list.blocked_users.all():
            account.block_list.blocked_users.remove(self.user)
            account.block_list.save()

@receiver(post_save, sender=User)
def create_block_list(sender, instance, created, **kwargs):
    if created:
        BlockedList.objects.create(user=instance)

@receiver(post_save, sender=User)
def create_friendlist(sender, instance, created, **kwargs):
    if created:
        FriendList.objects.create(user=instance)
