from rest_framework import serializers
from .models import BusinessUser
from .models import BusinessUser, SystemUser, Add


class BusinessUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessUser
        fields = ['id', 'first_name', 'last_name', 'role']

# Serializery dla SystemUser
class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer do rejestracji użytkownika systemowego.
    """
    password = serializers.CharField(write_only=True) # TODO zadbaj by to pole było jedynie do odczytu

    class Meta:
        model = SystemUser
        fields = ['username', 'email', 'password']  # TODO dodaj wszystkie potrzebne pola

    def validate_email(self, value):
        if SystemUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Użytkownik z takim adresem email już istnieje.")
        return value

    def create(self, validated_data):
        user = SystemUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class SystemUserSerializer(serializers.ModelSerializer):
    """
    Serializer do odczytu danych użytkownika systemowego.
    """
    class Meta:
        model = SystemUser
        fields =  ['username', 'email', 'password'] # TODO  dodaj wszystkie potrzebne pola



class AddSerializer(serializers.ModelSerializer):
    class Meta:
        model = Add
        fields = '__all__'
