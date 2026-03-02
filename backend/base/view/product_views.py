from decimal import Decimal, ROUND_HALF_UP
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.core.paginator import Paginator, EmptyPage
from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from base.models import Product, Review
from base.serializers import ProductSerializer

from django.contrib.auth.models import User
from django.db.models import Sum
from base.models import Order


# ============================
# Get all products (search + sorting + pagination)
# ============================
@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword', '').strip()
    page = int(request.query_params.get('page', 1))
    sort = request.query_params.get('sort', '')

    products = Product.objects.filter(
        Q(name__icontains=query) |
        Q(description__icontains=query)
    )

    # ============================
    # Sorting (Whitelisted)
    # ============================
    if sort == 'price_asc':
        products = products.order_by('price')
    elif sort == 'price_desc':
        products = products.order_by('-price')
    elif sort == 'newest':
        products = products.order_by('-createdAt')
    elif sort == 'rating':
        products = products.order_by('-rating', '-numReviews')
    else:
        products = products.order_by('-createdAt')  # default ordering

    # ============================
    # Pagination
    # ============================
    paginator = Paginator(products, 8)

    try:
        products_page = paginator.page(page)
    except EmptyPage:
        if paginator.num_pages > 0:
            products_page = paginator.page(paginator.num_pages)
        else:
            products_page = []

    serializer = ProductSerializer(products_page, many=True)

    return Response({
        'products': serializer.data,
        'page': page,
        'pages': paginator.num_pages
    })


# ============================
# Get single product
# ============================
@api_view(['GET'])
def getProduct(request, pk):
    product = get_object_or_404(Product, id=pk)
    serializer = ProductSerializer(product)
    return Response(serializer.data)


# ============================
# Get top-rated products
# ============================
@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.order_by('-rating', '-numReviews')[:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# ============================
# Create product (Admin)
# ============================
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user

    product = Product.objects.create(
        user=user,
        name='Sample Product',
        price=Decimal("0.00"),
        brand='',
        countInStock=0,
        category='',
        description=''
    )

    serializer = ProductSerializer(product)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# ============================
# Update product (Admin)
# ============================
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    product = get_object_or_404(Product, id=pk)
    data = request.data

    product.name = data.get('name', product.name)
    product.price = Decimal(str(data.get('price', product.price)))
    product.brand = data.get('brand', product.brand)
    product.countInStock = int(data.get('countInStock', product.countInStock))
    product.category = data.get('category', product.category)
    product.description = data.get('description', product.description)

    product.save()

    serializer = ProductSerializer(product)
    return Response(serializer.data)


# ============================
# Delete product (Admin)
# ============================
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = get_object_or_404(Product, id=pk)
    product.delete()
    return Response({'detail': 'Product deleted'})


# ============================
# Create product review
# ============================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = get_object_or_404(Product, id=pk)

    rating = int(request.data.get('rating', 0))
    comment = request.data.get('comment', '').strip()

    if product.reviews.filter(user=user).exists():
        return Response(
            {'detail': 'Product already reviewed'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if rating <= 0:
        return Response(
            {'detail': 'Please select a rating'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        with transaction.atomic():
            Review.objects.create(
                product=product,
                user=user,
                name=user.first_name or user.username,
                rating=rating,
                comment=comment
            )

            reviews = product.reviews.all()
            product.numReviews = reviews.count()

            avg_rating = sum([Decimal(r.rating) for r in reviews]) / Decimal(product.numReviews)
            product.rating = avg_rating.quantize(
                Decimal("0.01"),
                rounding=ROUND_HALF_UP
            )

            product.save()

        return Response({'detail': 'Review added'})

    except Exception:
        return Response(
            {'detail': 'Failed to add review'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    # ============================
# Admin Dashboard Metrics
# ============================
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAdminDashboard(request):

    total_products = Product.objects.count()
    total_orders = Order.objects.count()
    total_users = User.objects.count()

    revenue_data = Order.objects.filter(isPaid=True).aggregate(
        total_revenue=Sum('totalPrice')
    )

    total_revenue = revenue_data['total_revenue'] or 0

    pending_orders = Order.objects.filter(isDelivered=False).count()
    low_stock_products = Product.objects.filter(countInStock__lte=5).count()

    return Response({
        'totalProducts': total_products,
        'totalOrders': total_orders,
        'totalUsers': total_users,
        'totalRevenue': str(total_revenue),
        'pendingOrders': pending_orders,
        'lowStockProducts': low_stock_products,
    })
