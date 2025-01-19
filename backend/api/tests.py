from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import SystemUser
class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.register_url = reverse('register') 
        self.login_url = reverse('login') 
        self.user_data = {
            'username': 'testuser',
            'password': 'securepassword',
            'email': 'testuser@example.com'
        }

    def test_register_user(self):
        response = self.client.post(self.register_url, self.user_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SystemUser.objects.count(), 1)
        self.assertEqual(SystemUser.objects.get().username, self.user_data['username'])

    def test_login_user(self):
        user = SystemUser.objects.create_user(
            username=self.user_data['username'],
            password=self.user_data['password'],
            email=self.user_data['email']
        )

        login_data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }

        response = self.client.post(self.login_url, login_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)  
