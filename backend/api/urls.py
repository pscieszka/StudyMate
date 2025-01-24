from . import views
from django.urls import path

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include

urlpatterns = [
    path('register', views.register, name='register'),
    path('login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', views.home, name='home'),
    path('home/', views.home, name='home'),
    path('add/', views.add_view, name='add'),
    path('ads/', views.home, name='ads'),
    path('ads/id/<int:id>/', views.get_ad_details, name='ad_details'),
    path('search/<str:query>/', views.search_view, name='search'),
    path('ads/<str:username>', views.ads_by_username_view, name='ads_by_username'),
    path('ads/assigned/<str:assignedUsername>', views.ads_by_assignedUsername_view, name='ads_by_assignedUsername'),
    path('ads/deleteAssignment/<int:add_id>', views.delete_assignment, name='delete_assignment'),
    path('userinfo', views.get_user_info, name='user_info'),
    path('favorites/add/<int:add_id>/', views.add_to_favorites, name='add_to_favorites'),
    path('favorites/remove/<int:add_id>/', views.remove_from_favorites, name='remove_from_favorites'),
    path('favorites', views.get_favorites, name='get_favorites'),
    path("ads/apply/<int:ad_id>/", views.apply_to_ad, name="apply_to_ad"),
    path('ads/id/<int:id>/update/', views.update_ad, name='update_ad'),
    path('ads/id/<int:id>/delete/', views.delete_ad, name='delete_ad'),
    path('accounts/', include('allauth.urls')),
    path('oauth/callback/', views.google_oauth_callback, name='google_oauth_callback'),

]
