from django.db.models.base import method_get_order
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Add, SystemUser
from .serializers import AddSerializer, RegisterSerializer
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from allauth.socialaccount.models import SocialAccount
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


@swagger_auto_schema(
    methods=["POST"],
    operation_summary="Rejestracja użytkownika",
    operation_description="Rejestruje nowego użytkownika w systemie. Wymaga przesłania danych rejestracyjnych.",
    request_body=RegisterSerializer,
    responses={
        201: openapi.Response('Rejestracja zakończona sukcesem', RegisterSerializer),
        400: 'Błędne dane wejściowe',
    }
)
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=["GET"],
    operation_summary="Pobierz ogłoszenia",
    operation_description="Zwraca listę ogłoszeń na podstawie podanego tematu. Jeśli temat nie jest podany, zwraca wszystkie ogłoszenia.",
    manual_parameters=[
        openapi.Parameter('subject', openapi.IN_QUERY, description="Temat ogłoszenia", type=openapi.TYPE_STRING),
    ],
    responses={
        200: openapi.Response('Lista ogłoszeń', AddSerializer(many=True)),
        400: 'Błędne dane wejściowe'
    }
)
@api_view(['GET'])
def home(request):
    subject = request.GET.get('subject')
    if subject:
        ads = Add.objects.filter(subject=subject)
    else:
        ads = Add.objects.all()
    serializer = AddSerializer(ads, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@swagger_auto_schema(
    methods=["POST"],
    operation_summary="Dodanie ogłoszenia",
    operation_description="Umożliwia użytkownikowi dodanie nowego ogłoszenia. Wymaga autentykacji użytkownika.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            "subject": openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Temat lub dziedzina, np. Mathematics, Physics",
                example="Mathematics",
            ),
            "description": openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Opis ogłoszenia",
                example="Learn mathematics in a fun and interactive way",
            ),
            "level": openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Poziom nauczania, np. High School, University",
                example="High School",
            ),
            "learning_mode": openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Tryb nauki, np. In-person meetings, Online",
                example="Online",
                nullable=True,
            ),
            "frequency": openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Częstotliwość spotkań, np. Once a week, Twice a week",
                example="Once a week",
                nullable=True,
            ),
            "start_date": openapi.Schema(
                type=openapi.FORMAT_DATE,
                description="Data rozpoczęcia, np. 2025-01-27",
                example="2025-01-27",
                nullable=True,  # Może być pusty
            ),
            "username": openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Nazwa użytkownika, np. testuser",
                example="testuser",
            ),
        },
        required=["subject", "description", "level", "username"],  # Wymagane pola
    ),
    responses={
        201: openapi.Response('Ogłoszenie dodane pomyślnie', AddSerializer),
        400: 'Błędne dane wejściowe',
        401: 'Brak autoryzacji',
    },
)
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


@swagger_auto_schema(
    methods=["GET"],
    operation_summary="Wyszukiwanie ogłoszeń",
    operation_description="Zwraca ogłoszenia na podstawie zapytania tekstowego w temacie, opisie lub poziomie.",
    manual_parameters=[
        openapi.Parameter('query', openapi.IN_QUERY, description="Zapytanie do wyszukania w ogłoszeniach",
                          type=openapi.TYPE_STRING),
    ],
    responses={
        200: openapi.Response('Lista ogłoszeń', AddSerializer(many=True)),
        400: 'Brak zapytania',
    }
)
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


@swagger_auto_schema(
    methods=["GET"],
    operation_summary="Ogłoszenia użytkownika",
    operation_description="Zwraca ogłoszenia przypisane do konkretnego użytkownika.",
    responses={
        200: openapi.Response('Lista ogłoszeń', AddSerializer(many=True)),
        401: 'Brak autoryzacji',
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ads_by_username_view(request, username):
    ads = Add.objects.filter(username=username)
    serializer = AddSerializer(ads, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=["GET"],
    operation_summary="Pobierz dane użytkownika",
    operation_description="Zwraca dane użytkownika (username, email) po autentykacji.",
    responses={
        200: 'Dane użytkownika',
        401: 'Brak autoryzacji',
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    return Response({
        "username": request.user.username,
        "email": request.user.email,
    }, status=200)


@swagger_auto_schema(
    methods=["POST"],
    operation_summary="Dodanie ogłoszenia do ulubionych",
    operation_description="Umożliwia użytkownikowi dodanie ogłoszenia do ulubionych. Wymaga autentykacji.",
    responses={
        200: 'Ogłoszenie dodane do ulubionych',
        401: 'Brak autoryzacji',
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_favorites(request, add_id):
    add = Add.objects.get(id=add_id)
    request.user.favorites.add(add)
    return Response({"status": "added"})


@swagger_auto_schema(
    methods=["POST"],
    operation_summary="Usunięcie ogłoszenia z ulubionych",
    operation_description="Umożliwia użytkownikowi usunięcie ogłoszenia z ulubionych. Wymaga autentykacji.",
    responses={
        200: 'Ogłoszenie usunięte z ulubionych',
        401: 'Brak autoryzacji',
    }
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_favorites(request, add_id):
    add = Add.objects.get(id=add_id)
    request.user.favorites.remove(add)
    return Response({"status": "removed"})


@swagger_auto_schema(
    methods=["GET"],
    operation_summary="Pobranie ulubionych ogłoszeń użytkownika",
    operation_description="Zwraca listę ulubionych ogłoszeń przypisanych do użytkownika.",
    responses={
        200: 'Lista ulubionych ogłoszeń',
        401: 'Brak autoryzacji',
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorites(request):
    user = request.user
    favorite_ids = user.favorites.values_list('id', flat=True)
    return Response(list(favorite_ids))


@swagger_auto_schema(
    methods=["GET"],
    operation_summary="Szczegóły ogłoszenia",
    operation_description="Zwraca szczegóły ogłoszenia na podstawie jego ID.",
    responses={
        200: openapi.Response('Szczegóły ogłoszenia', AddSerializer),
        404: 'Ogłoszenie nie znalezione',
    }
)
@api_view(['GET'])
def get_ad_details(request, id):
    try:
        ad = Add.objects.get(id=id)
    except Add.DoesNotExist:
        return Response({"error": "Ogłoszenie nie zostało znalezione"}, status=status.HTTP_404_NOT_FOUND)

    serializer = AddSerializer(ad)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=["POST"],
    operation_summary="Aplikowanie do ogłoszenia",
    operation_description="Umożliwia użytkownikowi aplikowanie do ogłoszenia. Sprawdza, czy ogłoszenie ma już przypisanego użytkownika.",
    responses={
        200: 'Użytkownik przypisany do ogłoszenia',
        400: 'Ogłoszenie ma już przypisanego użytkownika',
        404: 'Ogłoszenie nie istnieje',
    }
)
@api_view(['POST'])
def apply_to_ad(request, ad_id):
    try:
        ad = Add.objects.get(id=ad_id)
        if ad.assignedUsername is not None:
            return Response(
                {"detail": "Ogłoszenie już ma przypisanego użytkownika."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = request.user.username
        ad.assignedUsername = user
        ad.save()

        return Response({"detail": "Użytkownik przypisany do ogłoszenia."}, status=status.HTTP_200_OK)
    except Add.DoesNotExist:
        return Response({"detail": "Ogłoszenie nie istnieje."}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    methods=["PUT"],
    operation_summary="Aktualizacja ogłoszenia",
    operation_description="Umożliwia użytkownikowi aktualizację swojego ogłoszenia. Wymaga autentykacji i sprawdzenia, czy użytkownik jest właścicielem ogłoszenia.",
    request_body=AddSerializer,
    responses={
        200: openapi.Response('Ogłoszenie zaktualizowane', AddSerializer),
        403: 'Brak uprawnień',
        404: 'Ogłoszenie nie znalezione',
    }
)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_ad(request, id):
    try:
        ad = Add.objects.get(id=id)
    except Add.DoesNotExist:
        return Response({"error": "Ogłoszenie nie zostało znalezione"}, status=status.HTTP_404_NOT_FOUND)

    if ad.username != request.user.username:
        return Response({"error": "Nie masz uprawnień do edycji tego ogłoszenia."}, status=status.HTTP_403_FORBIDDEN)

    serializer = AddSerializer(ad, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    methods=["DELETE"],
    operation_summary="Usunięcie ogłoszenia",
    operation_description="Umożliwia użytkownikowi usunięcie swojego ogłoszenia. Wymaga autentykacji i sprawdzenia, czy użytkownik jest właścicielem ogłoszenia.",
    responses={
        200: 'Ogłoszenie usunięte',
        403: 'Brak uprawnień',
        404: 'Ogłoszenie nie znalezione',
    }
)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_ad(request, id):
    try:
        ad = Add.objects.get(id=id)
    except Add.DoesNotExist:
        return Response({"error": "Ogłoszenie nie zostało znalezione"}, status=status.HTTP_404_NOT_FOUND)

    if ad.username != request.user.username:
        return Response({"error": "Nie masz uprawnień do usunięcia tego ogłoszenia."}, status=status.HTTP_403_FORBIDDEN)

    ad.delete()
    return Response({"message": "Ogłoszenie zostało usunięte pomyślnie."}, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=["GET"],
    operation_summary="Ogłoszenia przypisane do użytkownika",
    operation_description="Zwraca ogłoszenia przypisane do konkretnego użytkownika na podstawie assignedUsername.",
    responses={
        200: openapi.Response('Lista ogłoszeń', AddSerializer(many=True)),
        401: 'Brak autoryzacji',
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ads_by_assignedUsername_view(request, assignedUsername):
    ads = Add.objects.filter(assignedUsername=assignedUsername)
    serializer = AddSerializer(ads, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=["DELETE"],
    operation_summary="Usunięcie przypisania użytkownika do ogłoszenia",
    operation_description="Umożliwia użytkownikowi usunięcie przypisania do ogłoszenia, jeśli jest ono przypisane do niego.",
    responses={
        200: 'Przypisanie usunięte',
        403: 'Brak uprawnień',
        404: 'Ogłoszenie nie znalezione',
    }
)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_assignment(request, add_id):
    try:
        ad = Add.objects.get(id=add_id)
        if ad.assignedUsername != request.user.username:
            return Response(
                {"detail": "You are not allowed to unassign this ad."},
                status=status.HTTP_403_FORBIDDEN,
            )
        ad.assignedUsername = None
        ad.save()
        return Response(
            {"detail": "Assignment deleted successfully."},
            status=status.HTTP_200_OK,
        )
    except Add.DoesNotExist:
        return Response({"detail": "Ad not found."}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    methods=["POST"],
    operation_summary="Callback Google OAuth",
    operation_description="Obsługuje callback z Google OAuth i generuje tokeny JWT dla użytkownika.",
    responses={
        200: openapi.Response('Tokeny dostępowe wygenerowane pomyślnie'),
        400: 'Błędny token',
    }
)
@api_view(['POST'])
def google_oauth_callback(request):
    token = request.data.get('token')
    if not token:
        return Response({'detail': 'No token provided.'}, status=400)
    try:
        id_info = id_token.verify_oauth2_token(token, Request(), audience=None, clock_skew_in_seconds=10)
        google_id = id_info['sub']
        try:
            social_account = SocialAccount.objects.get(provider='google', extra_data__contains={'sub': google_id})
            user = social_account.user
        except SocialAccount.DoesNotExist:
            user = SystemUser.objects.create(username=id_info['email'], email=id_info['email'])
            social_account = SocialAccount.objects.create(
                user=user,
                provider='google',
                uid=google_id,
                extra_data=id_info,
            )
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })

    except ValueError as e:
        return Response({'detail': f'Invalid token: {str(e)}'}, status=400)
    except Exception as e:
        return Response({'detail': str(e)}, status=400)
