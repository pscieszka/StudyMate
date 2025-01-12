
from . import views
from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('users/', views.business_user_list, name='business_user_list'),
    path('users/<int:pk>/update/', views.business_user_update, name='business_user_update'),
    path('users/<int:pk>/', views.business_user_delete, name='business_user_delete'),

    path('register/', views.register, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #nowe endpointy, te wyzej pewnie trzeba bedzie usunac jak juz beda dzialac nowe
    
    path('', views.home, name='home'),
    path('home/', views.home, name='home'),
    path('add/', views.add_view, name='add'),
    path('account/', views.account_view, name='account'),

    
]

