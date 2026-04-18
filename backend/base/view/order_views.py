import logging
import traceback
from decimal import Decimal, ROUND_HALF_UP

from django.utils import timezone
from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from base.models import Order, OrderItem, ShippingAddress, Product
from base.serializers import OrderSerializer

logger = logging.getLogger(__name__)


# =========================
# Helpers
# =========================
def money(val):
    try:
        return Decimal(str(val)).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
    except Exception:
        return Decimal("0.00")


def to_int(val):
    try:
        return int(val)
    except Exception:
        return 0


def safe_image_url(product):
    try:
        if product.image:
            return product.image.url
    except Exception:
        pass
    return ""


# =========================
# CREATE ORDER
# =========================
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])

def addOrderItems(request):
    user = request.user
    data = request.data
    order_items = data.get("orderItems")

    if not order_items:
        return Response(
            {"detail": "No order items"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        with transaction.atomic():

            calculated_items_price = Decimal("0.00")

            order = Order.objects.create(
                user=user,
                paymentMethod=data.get("paymentMethod", "COD"),
                taxPrice=money(data.get("taxPrice")),
                shippingPrice=money(data.get("shippingPrice")),
                totalPrice=Decimal("0.00"),  # temp
            )

            shipping = data.get("shippingAddress", {})
            ShippingAddress.objects.create(
                order=order,
                address=shipping.get("address", ""),
                city=shipping.get("city", ""),
                postalCode=shipping.get("postalCode", ""),
                country=shipping.get("country", ""),
            )

            for item in order_items:
                product = get_object_or_404(
                    Product.objects.select_for_update(),
                    id=to_int(item.get("product"))
                )

                qty = to_int(item.get("qty"))

                if qty <= 0:
                    return Response(
                        {"detail": "Invalid quantity"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if product.countInStock < qty:
                    return Response(
                        {"detail": f"Insufficient stock for {product.name}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # ✅ ALWAYS use DB price
                price = product.price

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    name=product.name,
                    qty=qty,
                    price=price,
                    image=safe_image_url(product),
                )

                calculated_items_price += price * qty

                product.countInStock -= qty
                product.save()

            # ✅ FINAL TOTAL
            tax = money(data.get("taxPrice"))
            shipping_price = money(data.get("shippingPrice"))

            final_total = calculated_items_price + tax + shipping_price

            order.totalPrice = final_total
            order.save()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(
            "Order creation failed: %s\n%s",
            str(e),
            traceback.format_exc(),
        )
        return Response(
            {"detail": "Unexpected server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
        


# =========================
# GET ORDER BY ID
# =========================
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    order = get_object_or_404(Order, id=pk)

    if request.user.is_staff or order.user == request.user:
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    return Response(
        {"detail": "Not authorized"},
        status=status.HTTP_403_FORBIDDEN
    )


# =========================
# MARK ORDER AS PAID
# =========================
@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = get_object_or_404(Order, id=pk)

    order.isPaid = True
    order.paidAt = timezone.now()
    order.save()

    return Response({"detail": "Order marked as paid"})


# =========================
# MARK ORDER AS DELIVERED (ADMIN)
# =========================
@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = get_object_or_404(Order, id=pk)

    order.isDelivered = True
    order.deliveredAt = timezone.now()
    order.save()

    return Response({"detail": "Order marked as delivered"})


# =========================
# ADMIN: GET ALL ORDERS
# =========================
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.select_related('user').all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)
