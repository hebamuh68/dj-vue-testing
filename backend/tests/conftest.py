import pytest
from django.test import TestCase
from rest_framework.test import APIClient
from factory import Faker, Factory
from persons.models import Person
from factory.django import DjangoModelFactory



class PersonFactory(DjangoModelFactory):
    class Meta:
        model = Person

    first_name  = Faker('first_name')
    last_name = Faker('last_name')


# Useful for testing: API client, The client is used to make requests to the API
@pytest.fixture
def api_client():
    return APIClient()


# Useful for testing: Database persistence, The person is saved to the test database
@pytest.fixture
def sample_person():
    return PersonFactory.create()


# Useful for testing: Lists, filtering, pagination, etc.
@pytest.fixture
def multiple_persons():
    return PersonFactory.create_batch(3)


# Useful for testing: Authentication, The client is authenticated
@pytest.fixture
def authenticated_client(api_client):
    return api_client
