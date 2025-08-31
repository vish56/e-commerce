from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # ✅ SPECIFIC includes — yahi order rakho
    path('api/products/', include('base.url.product_urls')),  # ← include your producturls.py
    path('api/users/', include('base.url.user_urls')),        # NOTE: file ka naam userurls.py ho to yahi likho
    path('api/orders/', include('base.url.order_urls')),      # NOTE: file ka naam orderurls.py ho to yahi likho

    # ✅ JWT endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
