from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import SystemUser
from uuid import uuid4

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.register_url = reverse('register')
        self.login_url = reverse('token_obtain_pair')
        self.add_url = reverse('add')  
        self.user_data = {
            'username': 'testuser2',
            'email': 'testuser@test3.com',
            'password': 'testpass'
            
        }

        SystemUser.objects.create_user(
            username=self.user_data['username'],
            email=self.user_data['email'],
            password=self.user_data['password']
            
        )

    def testRegister(self):
        user_data = {
        'username': f'testuser_{uuid4().hex[:6]}',  
        'email': f'testuser_{uuid4().hex[:6]}@test.com', 
        'password': 'testpass'
    }
        response = self.client.post(self.register_url, user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(SystemUser.objects.count(), 2)
        self.assertTrue(SystemUser.objects.filter(username=self.user_data['username']).exists())

    def testLogin(self):
        login_data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }

        response = self.client.post(self.login_url, login_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def testLoginWithWrongPassword(self):
        login_data = {
            'username': self.user_data['username'],
            'password': 'wrongpassword'
        }

        response = self.client.post(self.login_url, login_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('token', response.data)

    def testLoggedUserAddPath(self):
        login_data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        token = login_response.data['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        task_data = {
            'subject': 'test',
            'description': 'test desc',
            'level': 'liceum',
            'learning_mode': 'Offline',
            'frequency': 'raz',
            'start_date': '2025-01-12',
            'username': self.user_data['username']
        }

        response = self.client.post(self.add_url, task_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data['data'])
        self.assertEqual(response.data['data']['subject'], task_data['subject'])

    def testAddPathWithoutCredentials(self):
        task_data = {
            'subject': 'test',
            'description': 'test desc',
            'level': 'liceum',
            'learning_mode': 'Offline',
            'frequency': 'raz',
            'start_date': '2025-01-12',
            'username': self.user_data['username']
        }

        response = self.client.post(self.add_url, task_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
