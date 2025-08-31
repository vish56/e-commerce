from django.urls import path
from base.view import user_views as views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.registerUser, name='register'),
    path('profile/', views.getUserProfile, name='user-profile'),
    path('', views.getUsers, name='users'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
