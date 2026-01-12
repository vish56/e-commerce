from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # API routes
    path('api/products/', include('base.url.product_urls')),
    path('api/users/', include('base.url.user_urls')),
    path('api/orders/', include('base.url.order_urls')),

    # JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# 🔥 IMPORTANT: serve media EVEN WHEN DEBUG=False
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
