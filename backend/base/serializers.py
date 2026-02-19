from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Order, OrderItem, ShippingAddress


# =========================
# USER SERIALIZER
# =========================

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'is_staff']

    def get_name(self, obj):
        return obj.first_name if obj.first_name else obj.email


# =========================
# PRODUCT SERIALIZER
# =========================

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


# =========================
# ORDER ITEM SERIALIZER
# =========================

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = '__all__'

    def get_product(self, obj):
        return obj.product.id


# =========================
# SHIPPING ADDRESS SERIALIZER
# =========================

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


# =========================
# ORDER SERIALIZER
# =========================

class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField()
    shippingAddress = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        # Uses related_name='orderItems'
        items = obj.orderItems.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            # Uses related_name='shippingAddress'
            address = ShippingAddressSerializer(obj.shippingAddress, many=False).data
            return address
        except:
            return None

    def get_user(self, obj):
        return {
            'id': obj.user.id,
            'name': obj.user.first_name if obj.user.first_name else obj.user.email,
            'email': obj.user.email,
        }
