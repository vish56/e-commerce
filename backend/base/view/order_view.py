# backend/base/view/order_view.py
import logging
import traceback
from decimal import Decimal, InvalidOperation
from django.utils import timezone
from django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Order, OrderItem, ShippingAddress, Product
from base.serializers import OrderSerializer

logger = logging.getLogger(__name__)

def safe_image_url(product):
    try:
        if hasattr(product, 'image') and product.image:
            return getattr(product.image, 'url', str(product.image))
    except Exception:
        return ''
    return ''

def _coerce_int(val):
    try:
        return int(val)
    except Exception:
        try:
            return int(str(val).strip())
        except Exception:
            return None

def _extract_items(data):
    """
    Accepts multiple payload shapes:
    - {"orderItems": [...]} (preferred)
    - {"cartItems": [...]}
    - Or (rare) directly a list as the root
    """
    if isinstance(data, list):
        return data, None

    if not isinstance(data, dict):
        return None, "Expected JSON object; got something else."

    items = data.get('orderItems') or data.get('cartItems')
    if not items:
        return None, "No order items (expected 'orderItems' or 'cartItems')."

    if not isinstance(items, list):
        return None, "Order items must be a list."

    return items, None

def _extract_product_id(item):
    if not isinstance(item, dict):
        return None

    pid = (
        item.get('product')
        or item.get('productId')
        or item.get('product_id')
        or item.get('_id')
        or item.get('id')
    )
    if pid is None and 'product' in item:
        val = item['product']
        if isinstance(val, dict):
            pid = val.get('id') or val.get('_id') or val.get('pk') or val.get('product')
        elif isinstance(val, (int, str)):
            pid = val

    return _coerce_int(pid)

def _safe_decimal(v, default=Decimal('0')):
    """Convert safely to Decimal"""
    try:
        if v is None or v == '':
            return default
        if isinstance(v, Decimal):
            return v
        return Decimal(str(v))
    except (InvalidOperation, ValueError, TypeError):
        return default

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data or {}

    try:
        items, err = _extract_items(data)
        if err:
            return Response({'detail': err}, status=status.HTTP_400_BAD_REQUEST)
        if len(items) == 0:
            return Response({'detail': 'No order items'}, status=status.HTTP_400_BAD_REQUEST)

        # Debug
        print("DEBUG addOrderItems user:", user)
        print("DEBUG addOrderItems payload:", data)

        # Totals
        payment_method = data.get('paymentMethod', 'COD')
        tax_price = _safe_decimal(data.get('taxPrice', 0))
        shipping_price = _safe_decimal(data.get('shippingPrice', 0))
        total_price = _safe_decimal(data.get('totalPrice', 0))
        items_price = _safe_decimal(data.get('itemsPrice', 0))

        order_kwargs = {}
        if hasattr(Order, 'paymentMethod'):
            order_kwargs['paymentMethod'] = payment_method
        if hasattr(Order, 'taxPrice'):
            order_kwargs['taxPrice'] = tax_price
        if hasattr(Order, 'shippingPrice'):
            order_kwargs['shippingPrice'] = shipping_price
        if hasattr(Order, 'totalPrice'):
            order_kwargs['totalPrice'] = total_price
        if hasattr(Order, 'itemsPrice'):
            order_kwargs['itemsPrice'] = items_price

        with transaction.atomic():
            order = Order.objects.create(user=user, **order_kwargs)

            # Shipping
            ship = data.get('shippingAddress') if isinstance(data, dict) else None
            if isinstance(ship, dict) and ship:
                ShippingAddress.objects.create(
                    order=order,
                    address=ship.get('address', ''),
                    city=ship.get('city', ''),
                    postalCode=ship.get('postalCode', ''),
                    country=ship.get('country', ''),
                )

            # Items
            for idx, it in enumerate(items):
                if not isinstance(it, dict):
                    raise ValueError(f'Order item at index {idx} not an object')

                product_id = _extract_product_id(it)
                if not product_id:
                    raise ValueError(f'Order item at index {idx} missing product id')

                product = Product.objects.select_for_update().filter(pk=product_id).first()
                if not product:
                    raise ValueError(f'Product id {product_id} not found')

                qty = _coerce_int(it.get('qty') or it.get('quantity') or 0) or 0
                if qty <= 0:
                    raise ValueError(f'Invalid qty for product id {product_id}')

                raw_price = it.get('price', getattr(product, 'price', 0))
                item_price = _safe_decimal(raw_price, default=_safe_decimal(getattr(product, 'price', 0)))

                OrderItem.objects.create(
                    product=product,
                    order=order,
                    name=getattr(product, 'name', ''),
                    qty=qty,
                    price=item_price,
                    image=safe_image_url(product),
                )

                if getattr(product, 'countInStock', None) is not None:
                    if product.countInStock < qty:
                        raise ValueError(f'Not enough stock for product id {product_id}')
                    product.countInStock = max(product.countInStock - qty, 0)
                    product.save()

    except ValueError as ve:
        logger.error("ValueError in addOrderItems: %s", str(ve))
        return Response({'detail': str(ve)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error("Exception in addOrderItems: %s\n%s", str(e), traceback.format_exc())
        return Response({'detail': 'Server error while creating order. Check server logs.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    print("DEBUG order stored values:", {
        'itemsPrice': getattr(order, 'itemsPrice', None),
        'shippingPrice': getattr(order, 'shippingPrice', None),
        'taxPrice': getattr(order, 'taxPrice', None),
        'totalPrice': getattr(order, 'totalPrice', None),
    })

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    try:
        order = Order.objects.get(id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        return Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_403_FORBIDDEN)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    try:
        order = Order.objects.get(id=pk)
        order.isPaid = True
        order.paidAt = timezone.now()
        order.save()
        return Response({'detail': 'Order was paid'})
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    try:
        order = Order.objects.get(id=pk)
        order.isDelivered = True
        order.deliveredAt = timezone.now()
        order.save()
        return Response({'detail': 'Order was delivered'})
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
