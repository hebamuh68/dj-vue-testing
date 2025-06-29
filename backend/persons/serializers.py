from rest_framework import serializers
from .models import Person


class PersonSerializer(serializers.ModelSerializer):
    """
    Serializer for Person model.
    """
    class Meta:
        model = Person
        fields = ['id', 'first_name', 'last_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class PersonCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating Person instances.
    """
    class Meta:
        model = Person
        fields = ['first_name', 'last_name'] 