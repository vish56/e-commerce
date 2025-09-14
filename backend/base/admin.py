from django.contrib import admin
from .models import Product, Order, OrderItem, ShippingAddress, Review


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'price', 'countInStock', 'rating', 'numReviews', 'createdAt')
    list_filter = ('brand', 'category')
    search_fields = ('name', 'brand', 'category')
    ordering = ('-createdAt',)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'user', 'rating', 'createdAt')
    list_filter = ('rating', 'createdAt')
    search_fields = ('product__name', 'user__username')
    ordering = ('-createdAt',)


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'totalPrice', 'isPaid', 'paidAt', 'isDelivered', 'deliveredAt', 'createdAt')
    list_filter = ('isPaid', 'isDelivered', 'createdAt')
    search_fields = ('user__username', 'id')
    ordering = ('-createdAt',)
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'name', 'qty', 'price')
    search_fields = ('order__id', 'product__name')
    ordering = ('-order',)


@admin.register(ShippingAddress)
class ShippingAddressAdmin(admin.ModelAdmin):
    list_display = ('order', 'address', 'city', 'postalCode', 'country', 'shippingPrice')
    search_fields = ('address', 'city', 'postalCode', 'country')
    ordering = ('order',)
