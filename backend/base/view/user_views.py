from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.db import transaction

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status


# ================================
# LOGIN
# ================================
@api_view(['POST'])
def login_view(request):
    email = request.data.get('email', '').lower().strip()
    password = request.data.get('password', '')

    if not email or not password:
        return Response(
            {'detail': 'Email and password required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=email, password=password)

    if user is None:
        return Response(
            {'detail': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
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


# ================================
# REGISTER
# ================================
@api_view(['POST'])
def registerUser(request):
    name = request.data.get('name', '').strip()
    email = request.data.get('email', '').lower().strip()
    password = request.data.get('password', '')

    if not name or not email or not password:
        return Response(
            {'detail': 'All fields are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(email=email).exists():
        return Response(
            {'detail': 'User with this email already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        with transaction.atomic():
            user = User.objects.create_user(
                first_name=name,
                username=email,
                email=email,
                password=password
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

    except Exception:
        return Response(
            {'detail': 'Registration failed'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# ================================
# GET PROFILE (Logged In User)
# ================================
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


# ================================
# GET ALL USERS (ADMIN)
# ================================
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()

    data = [
        {
            'id': user.id,
            'name': user.first_name,
            'email': user.email,
            'isAdmin': user.is_staff,
        }
        for user in users
    ]

    return Response(data)


# ================================
# DELETE USER (ADMIN)
# ================================
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    user = get_object_or_404(User, id=pk)
    user.delete()
    return Response({'detail': 'User deleted'})


# ================================
# GET USER BY ID (ADMIN)
# ================================
@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = get_object_or_404(User, id=pk)

    return Response({
        'id': user.id,
        'name': user.first_name,
        'email': user.email,
        'isAdmin': user.is_staff,
    })


# ================================
# UPDATE USER (ADMIN)
# ================================
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    user = get_object_or_404(User, id=pk)

    data = request.data

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
