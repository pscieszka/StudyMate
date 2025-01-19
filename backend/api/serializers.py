from rest_framework import serializers

from .models import SystemUser, Add
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True) 

    class Meta:
        model = SystemUser
        fields = ['username', 'email', 'password'] 

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
    class Meta:
        model = SystemUser
        fields =  ['username', 'email', 'password'] 

class AddSerializer(serializers.ModelSerializer):
    class Meta:
        model = Add
        fields = '__all__'

