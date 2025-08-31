from django.urls import path, include
from base.view import product_views as product_views

urlpatterns = [
    # Product Routes (for now, still here)
    path('products/', product_views.getProducts, name='products'),
    path('products/<str:pk>/', product_views.getProduct, name='product'),

    # User Routes from separate file
    path('users/', include('base.url.user_urls')),
]
