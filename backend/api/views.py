from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Add   
from .serializers import AddSerializer, RegisterSerializer
from rest_framework.permissions import IsAuthenticated


@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def home(request):
    subject = request.GET.get('subject')
    if subject:
        ads = Add.objects.filter(subject=subject)
    else:
        ads = Add.objects.all()
    serializer = AddSerializer(ads, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_view(request):
    data = request.data.copy()  

    serializer = AddSerializer(data=data)
    if serializer.is_valid():
        serializer.save()  
        return Response(
            {"message": "Ogłoszenie zostało dodane pomyślnie!", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def account(request):
    return Response({"message": "account, dziala"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def search_view(request):
    query = request.GET.get('query')
    if query:
        ads = Add.objects.filter(subject__icontains=query)
    else:
        ads = Add.objects.all()
    serializer = AddSerializer(ads, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
def ads_by_username_view(request, username):
    ads = Add.objects.filter(username=username)  
    serializer = AddSerializer(ads, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    return Response({
        "username": request.user.username,
        "email": request.user.email,
    }, status=200)