from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission


class BusinessUser(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    role = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.first_name} {self.last_name} - {self.role}'


class SystemUser(AbstractUser):
    """
    Systemowy użytkownik odpowiedzialny za logowanie i rejestrację.
    """
    email = models.EmailField(unique=True) # TODO zadbaj by wymagana była unikalność

    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set", 
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions_set",  
        blank=True,
    )
