from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Add   
from .serializers import AddSerializer, RegisterSerializer

@api_view(['GET'])
def home(request):
    """
    Widok obsługujący pobieranie wszystkich ogłoszeń z opcją filtrowania po przedmiocie.
    """
    subject = request.GET.get('subject')
    if subject:
        ads = Add.objects.filter(subject=subject)
    else:
        ads = Add.objects.all()
    serializer = AddSerializer(ads, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_view(request):
    """
    Widok obsługujący dodawanie ogłoszeń.
    """
    if request.method == 'POST':
        serializer = AddSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Zapisz dane w bazie
            return Response({"message": "Ogłoszenie zostało dodane pomyślnie!", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def account(request):
    return Response({"message": "account, dziala"}, status=status.HTTP_200_OK)
