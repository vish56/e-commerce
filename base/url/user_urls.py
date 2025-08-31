from django.urls import path
from base.view import user_views as views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('register/', views.registerUser, name='register'),
    path('profile/', views.getUserProfile, name='user-profile'),
    path('', views.getUsers, name='users'),  # admin: list all users
    path('<str:pk>/', views.getUserById, name='user-by-id'),  # admin: get by id
    path('<str:pk>/update/', views.updateUser, name='user-update'),  # admin: update user
    path('<str:pk>/delete/', views.deleteUser, name='user-delete'),  # admin: delete user
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
