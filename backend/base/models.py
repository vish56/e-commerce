from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    name = models.CharField(max_length=200, blank=True, default="")
    image = models.ImageField(null=True, blank=True, default='/placeholder.png')
    brand = models.CharField(max_length=200, blank=True, default="")
    category = models.CharField(max_length=200, blank=True, default="")
    description = models.TextField(blank=True, default="")

    rating = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )

    numReviews = models.IntegerField(default=0, validators=[MinValueValidator(0)])

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )

    countInStock = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)]
    )

    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-createdAt']

    def __str__(self):
        return self.name or "Product"


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    name = models.CharField(max_length=200, blank=True, default="")
    rating = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    comment = models.TextField(blank=True, default="")

    createdAt = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-createdAt']

    def __str__(self):
        return f"Review {self.rating}"


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, db_index=True)

    paymentMethod = models.CharField(max_length=200, blank=True, default="")

    taxPrice = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shippingPrice = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    totalPrice = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(null=True, blank=True)

    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(null=True, blank=True)

    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-createdAt']

    def __str__(self):
        return f"Order {self.id}"


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)

    # ✅ KEEP null=True to avoid migration chaos
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="orderItems",
        null=True
    )

    name = models.CharField(max_length=200, blank=True, default="")
    qty = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(0)]
    )
    image = models.CharField(max_length=200, blank=True, default="")

    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.name or "OrderItem"


class ShippingAddress(models.Model):
    # ✅ KEEP null=True & blank=True to avoid migration prompt
    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name="shippingAddress",
        null=True,
        blank=True
    )

    address = models.CharField(max_length=200, blank=True, default="")
    city = models.CharField(max_length=200, blank=True, default="")
    postalCode = models.CharField(max_length=200, blank=True, default="")
    country = models.CharField(max_length=200, blank=True, default="")

    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.address or "ShippingAddress"
