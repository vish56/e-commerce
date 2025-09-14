from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status


# -------------------------------
# Login
# -------------------------------
@api_view(['POST'])
def login_view(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    try:
        user_obj = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    user = authenticate(username=user_obj.username, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'name': user.first_name,
            'email': user.email,
            'isAdmin': user.is_staff,
            'id': user.id,
        })
    else:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


# -------------------------------
# Register
# -------------------------------
@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create_user(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=data['password']
        )
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'name': user.first_name,
            'email': user.email,
            'isAdmin': user.is_staff,
            'id': user.id,
        })
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# Get user profile (logged-in user)
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    return Response({
        'id': user.id,
        'name': user.first_name,
        'email': user.email,
        'isAdmin': user.is_staff,
    })


# -------------------------------
# Get all users (admin only)
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    user_data = []

    for user in users:
        user_data.append({
            'id': user.id,
            'name': user.first_name,
            'email': user.email,
            'isAdmin': user.is_staff,
        })

    return Response(user_data)


# -------------------------------
# Delete user (admin only)
# -------------------------------
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    try:
        user = User.objects.get(id=pk)
        user.delete()
        return Response({'detail': 'User deleted'})
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


# -------------------------------
# Get user by ID (admin only)
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    try:
        user = User.objects.get(id=pk)
        return Response({
            'id': user.id,
            'name': user.first_name,
            'email': user.email,
            'isAdmin': user.is_staff,
        })
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


# -------------------------------
# Update user (admin only)
# -------------------------------
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    data = request.data
    try:
        user = User.objects.get(id=pk)
        user.first_name = data.get('name', user.first_name)
        user.email = data.get('email', user.email)
        user.username = data.get('email', user.username)
        user.is_staff = data.get('isAdmin', user.is_staff)
        user.save()

        return Response({
            'id': user.id,
            'name': user.first_name,
            'email': user.email,
            'isAdmin': user.is_staff,
        })
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
