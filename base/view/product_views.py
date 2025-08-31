from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator, EmptyPage
from django.db.models import Q

from base.models import Product, Review
from base.serializers import ProductSerializer


# ============================
# Get all products (with search & pagination)
# ============================
@api_view(['GET'])
def getProducts(request):
    query = request.query_params.get('keyword') or ''
    products = Product.objects.filter(
        Q(name__icontains=query) | Q(description__icontains=query)
    )

    # Pagination (8 products per page)
    page = int(request.query_params.get('page') or 1)
    paginator = Paginator(products, 8)

    try:
        products_page = paginator.page(page)
    except EmptyPage:
        products_page = paginator.page(paginator.num_pages)

    serializer = ProductSerializer(products_page, many=True)
    return Response({
        'products': serializer.data,
        'page': page,
        'pages': paginator.num_pages
    })


# ============================
# Get single product by ID
# ============================
@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


# ============================
# Get top-rated products
# ============================
@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.all().order_by('-rating', '-numReviews')[:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


# ============================
# Create a new product (Admin only)
# ============================
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name='Sample Product',
        price=0,
        brand='',
        countInStock=0,
        category='',
        description=''
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# ============================
# Update a product (Admin only)
# ============================
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    product.name = data.get('name', product.name)
    product.price = data.get('price', product.price)
    product.brand = data.get('brand', product.brand)
    product.countInStock = data.get('countInStock', product.countInStock)
    product.category = data.get('category', product.category)
    product.description = data.get('description', product.description)
    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


# ============================
# Delete a product (Admin only)
# ============================
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    product.delete()
    return Response({'detail': 'Product deleted'})


# ============================
# Create product review (User only)
# ============================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data
    rating = int(data.get('rating', 0))
    comment = data.get('comment', '').strip()

    # Check if user already reviewed
    if product.reviews.filter(user=user).exists():
        return Response({'detail': 'Product already reviewed'}, status=status.HTTP_400_BAD_REQUEST)

    if rating <= 0:
        return Response({'detail': 'Please select a rating'}, status=status.HTTP_400_BAD_REQUEST)

    # Create review
    review = Review.objects.create(
        product=product,
        user=user,
        name=user.first_name or user.username,
        rating=rating,
        comment=comment
    )

    # Update product rating & review count
    reviews = product.reviews.all()
    product.numReviews = reviews.count()
    product.rating = sum([rev.rating for rev in reviews]) / reviews.count()
    product.save()

    return Response({'detail': 'Review added'})
