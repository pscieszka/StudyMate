
from . import views
from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register', views.register, name='register'),
    path('login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('', views.home, name='home'),
    path('home/', views.home, name='home'),
    path('add/', views.add_view, name='add'),
    #path('account/', views.account_view, name='account'),
    path('ads/', views.home, name='ads'),  # To już masz w `home`
    path('ads/<int:id>/', views.get_ad_details, name='ad_details'),  
    path('ads/<str:subject>/', views.home, name='subject_ads'),
    path('search/<str:query>/', views.search_view, name='search'),
    path('ads/<str:username>', views.ads_by_username_view, name='ads_by_username'),
    path('userinfo', views.get_user_info, name='user_info'), # zeby dodac kto tworzy zadanie i potem zeby mozna bylo filtrowac po uzytkowniku
    path('favorites/add/<int:add_id>/', views.add_to_favorites, name='add_to_favorites'),
    path('favorites/remove/<int:add_id>/', views.remove_from_favorites, name='remove_from_favorites'),
    path('favorites', views.get_favorites, name='get_favorites'),

]

