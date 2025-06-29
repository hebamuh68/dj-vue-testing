import pytest
from persons.models import Person


# Ensures DB access in all tests
pytestmark = pytest.mark.django_db

class TestPersonModel:
    # __str__ should return 'First Last' format.
    def test_person_str(self,sample_person):
        expected_str = f"{sample_person.first_name} {sample_person.last_name}"
        assert str(sample_person) == expected_str


    def test_person_eq_by_pk(self,sample_person):
        same_person = Person.objects.get(pk = sample_person.pk)
        assert sample_person == same_person


    def test_person_ineq_by_pk(self,sample_person):
        other_person = Person.objects.create(first_name = "Other", last_name="Name")
        assert sample_person != other_person

    def test_person_hash(self,sample_person):
        person_set = {sample_person}
        assert sample_person in person_set

    def test_person_ordering(self,multiple_persons):
        sorted_persons = sorted(multiple_persons, key=lambda p: (p.last_name, p.first_name))
        db_persons = list(Person.objects.all())
        assert db_persons == sorted_persons