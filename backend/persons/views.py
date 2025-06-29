from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Person
from .serializers import PersonSerializer, PersonCreateSerializer


@api_view(['GET'])
def hello_person(request, last_name):
    """
    Equivalent to Spring Boot's /hello/{lastName} endpoint.
    """
    try:
        person = Person.objects.filter(last_name=last_name).first()
        if person:
            message = f"Hello {person.first_name} {person.last_name}!"
            return JsonResponse({"message": message})
        else:
            message = f"Who is this '{last_name}' you're talking about?"
            return JsonResponse({"message": message})
    except Exception as e:
        message = f"Who is this '{last_name}' you're talking about?"
        return JsonResponse({"message": message})


@api_view(['GET', 'POST'])
def person_list(request):
    """
    List all persons or create a new person.
    """
    if request.method == 'GET':
        persons = Person.objects.all()
        serializer = PersonSerializer(persons, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PersonCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def person_detail(request, pk):
    """
    Retrieve, update or delete a person.
    """
    person = get_object_or_404(Person, pk=pk)
    
    if request.method == 'GET':
        serializer = PersonSerializer(person)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = PersonSerializer(person, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        person.delete()
        return Response(status=status.HTTP_204_NO_CONTENT) 