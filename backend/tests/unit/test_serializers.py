import pytest
from persons.models import Person
from persons.serializers import PersonSerializer, PersonCreateSerializer

pytestmark = pytest.mark.django_db


class TestPersonSerializer:
    
    def test_output_fields(self, sample_person):
        serializer = PersonSerializer(sample_person)
        data = serializer.data

        assert data['id'] == sample_person.id
        assert data['first_name'] == sample_person.first_name
        assert data['last_name'] == sample_person.last_name
        assert 'created_at' in data
        assert 'updated_at' in data


    def test_read_only_fields(self, sample_person):
        payload = {
            'id': 999,
            'created_at': '2030-01-01T00:00:00Z',
            'updated_at': '2030-01-01T00:00:00Z',
            'first_name': 'Edited',
            'last_name': 'Person'
        }

        serializer = PersonSerializer(instance=sample_person, data=payload)
        assert serializer.is_valid(), serializer.errors #show detailed error messages
        updated_person = serializer.save()

        # Read-only fields should not be updated
        assert updated_person.id == sample_person.id
        assert updated_person.first_name == 'Edited'
        assert updated_person.last_name == 'Person'


class TestPersonCreateSerializer:
    
    def test_valid_data_creates_person(self):
        payload ={
            'first_name': 'Heba',
            'last_name':'Hashim'
        } 
        serializer = PersonCreateSerializer(data=payload)
        assert serializer.is_valid(), serializer.errors
        new_person = serializer.save()

        assert new_person.first_name == 'Heba'
        assert new_person.last_name == 'Hashim'
        assert isinstance(new_person, Person)


    def test_missing_required_field(self):
        payload = {
            'first_name': 'OnlyFirstName'
        }
        serializer = PersonCreateSerializer(data=payload)
        assert not serializer.is_valid(), serializer.errors
        assert 'last_name' in serializer.errors
    


    def test_empty_fields(self):
        payload ={
            'first_name': '',
            'last_name':''
        } 
        serializer = PersonCreateSerializer(data=payload)
        assert not serializer.is_valid(), serializer.errors

        assert 'first_name' in serializer.errors
        assert 'last_name' in serializer.errors
