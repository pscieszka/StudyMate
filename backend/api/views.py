from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Add   
from .serializers import AddSerializer, RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q


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
def search_view(request, query):
    if not query:
        return Response({"message": "Brak zapytania"}, status=status.HTTP_400_BAD_REQUEST)

    words = query.split()

    q_objects = Q(subject__icontains=words[0]) | Q(description__icontains=words[0]) | Q(level__icontains=words[0])

    for word in words[1:]:
        q_objects &= (Q(subject__icontains=word) |
                      Q(description__icontains=word) |
                      Q(level__icontains=word))

    ads = Add.objects.filter(q_objects)

    serializer = AddSerializer(ads, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_favorites(request, add_id):
    add = Add.objects.get(id=add_id)
    request.user.favorites.add(add)
    return Response({"status": "added"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_favorites(request, add_id):
    add = Add.objects.get(id=add_id)
    request.user.favorites.remove(add)
    return Response({"status": "removed"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorites(request):
    user = request.user
    favorite_ids = user.favorites.values_list('id', flat=True) 
    return Response(list(favorite_ids))

@api_view(['GET'])
def get_ad_details(request, id):
    try:
        ad = Add.objects.get(id=id)
    except Add.DoesNotExist:
        return Response({"error": "Ogłoszenie nie zostało znalezione"}, status=status.HTTP_404_NOT_FOUND)

    serializer = AddSerializer(ad)
    return Response(serializer.data, status=status.HTTP_200_OK)