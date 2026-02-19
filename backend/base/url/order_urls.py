from django.urls import path
from base.view import order_views as views

urlpatterns = [
    path('', views.getOrders, name='orders'),  # 🔥 ADMIN LIST
    path('add/', views.addOrderItems, name='order-add'),
    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
    path('<str:pk>/deliver/', views.updateOrderToDelivered, name='delivered'),
]
