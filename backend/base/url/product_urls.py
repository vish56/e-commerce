from django.urls import path
from base.view import product_views as views

urlpatterns = [
    path('top/', views.getTopProducts, name='top-products'),      # specific FIRST
    path('create/', views.createProduct, name='product-create'),  # (if exists)
    path('<int:pk>/reviews/', views.createProductReview, name='product-review'),
    path('<int:pk>/', views.getProduct, name='product-detail'),   # dynamic AFTER specifics
    path('', views.getProducts, name='products'),                 # list LAST
]
