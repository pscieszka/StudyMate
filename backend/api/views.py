from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import BusinessUser
from .models import SystemUser
from .serializers import BusinessUserSerializer, RegisterSerializer, SystemUserSerializer
from django.contrib.auth import get_user_model

SystemUser = get_user_model()

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def business_user_list(request):
    if request.method == 'GET':
        users = BusinessUser.objects.all()
        serializer = BusinessUserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = BusinessUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def business_user_detail(request, pk):
    try:
        user = BusinessUser.objects.get(pk=pk)
    except BusinessUser.DoesNotExist:
        return Response({"error": "BusinessUser not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = BusinessUserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def business_user_update(request, pk):
    try:
        user = BusinessUser.objects.get(pk=pk)
    except BusinessUser.DoesNotExist:
        return Response({"error": "BusinessUser not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = BusinessUserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def business_user_delete(request, pk):
    try:
        user = BusinessUser.objects.get(pk=pk)
    except BusinessUser.DoesNotExist:
        return Response({"error": "BusinessUser not found"}, status=status.HTTP_404_NOT_FOUND)

    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def system_user_detail(request, pk):
    try:
        user = SystemUser.objects.get(pk=pk)
    except SystemUser.DoesNotExist:
        return Response({"error": "SystemUser not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = SystemUserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)