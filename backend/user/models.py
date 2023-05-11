from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import UserManager, PermissionsMixin
from django.db import models
from datetime import date
from backend.user.enums import Gender


class CustomUserManager(UserManager):
    """
    first we need a customusermanager, that will be responsible for holding the User.objects manager
    then define a function:
        1) def _create_user(self, email, password, **extra_fields):
    """

    def _create_user(self, email, password, **extra_fields):
        """
        This private function helps us in creating our users
        :param email:
        :param password:
        :param extra_fields:
        :return: user type model
        """

        email = self.normalize_email(email) # Normalize the email address by lowercasing the domain part of it.
        user = self.model(email=email, **extra_fields) # We create a model instance
        user.set_password(password) # Turn a plain-text password into a hash for database storage
        user.save(using=self._db) # Save the current instance to the db, using the database we specified inside settings.py

        return user

    def create_user(self, email=None, password=None, **extra_fields):
        """
        We create this function in order to set default values, depending it it's a regular user or a superuser
        setting the email and password to None, helps with having more flexibility
            1) only the email is required to create an user, the password being automatically generated
            2) email has to have a value, that's why we validate it, BUT the default in practice is to set it to None,
                so that in case of mass import users, to be able to still create them, setting the email afterwards.
        :param username:
        :param email:
        :param password:
        :param extra_fields:
        :return:
        """
        # Insert key with a value of default if key is not in the dictionary.
        extra_fields.setdefault('is_staff', False) # is_staff grants the user permission to django admin site and its features
        extra_fields.setdefault('is_superuser', False) # is_superuser grants the user all permissions on the site
        extra_fields.setdefault('support', False)

        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email=None, password=None, **extra_fields):
        """
            this will be called the moment we run 'python manage.py createsuperuser'
            the base function from UserManager also has a username field that is specified in the parameter list,
            it's not a must, Django will create a username field for us.
            inside the CustomUser() we can specify which of the fields we have should be considered the username, used to log in
        """
        extra_fields.setdefault('is_staff', True)  # is_staff grants the user permission to django admin site and its features
        extra_fields.setdefault('is_superuser', True)  # is_superuser grants the user all permissions on the site
        extra_fields.setdefault('is_active', True)

        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
        it inherits PermissionsMixin so a user can be assigned specific permissions, view, edit, create, delete
    """

    email = models.EmailField(blank=True, default='', unique=True) # being EmailField ensures that each user has a unique email address
    username = models.CharField(max_length=255, blank=True, default='')
    bio = models.CharField(max_length=255, blank=True, default='')
    gender = models.CharField(max_length=1, choices=Gender.choices, blank=True)
    birthdate = models.DateField(blank=True, default=date.today, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics', blank=True, null=True)

    is_active = models.BooleanField(default=False) # this is set to default True so the user can log in, can also be False, depending on email confirmation
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_support = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(blank='True', null=True)

    objects = CustomUserManager() # when we have queries such as User.objects.all, it will used this objects, instead of the default one

    USERNAME_FIELD = 'email' # this field is what's being used to authenticate, default is username
    EMAIL_FIELD = 'email'  # it's not 100% necessary but in case of multiple emails this is the one that should be used for authentication
    REQUIRED_FIELDS = [] # list of required fields, in case we have them

    class Meta:
        """
        a meta class is used to customize the behaviour of the model, such as giving permissions or having the data sorted
        by a specified field
        """
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username or self.email.split('@')[0]



