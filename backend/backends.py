from django.contrib.auth.backends import BaseBackend
from .user.models import User

class EmailBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return None
        if user is not None and user.check_password(password):
            if user.is_active:
                return user
        return None