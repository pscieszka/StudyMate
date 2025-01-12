from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def home(request):
    return Response({"message": "home, dziala"}, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
def add(request):
    if request.method == 'POST':
        return Response({"message": "Data added successfully!"}, status=status.HTTP_201_CREATED)
    return Response({"message": "add, dziala"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def account(request):

    return Response({"message": "account, dziala"}, status=status.HTTP_200_OK)