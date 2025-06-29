from django.db import models


class Person(models.Model):
    """
    Represents a person with a first and last name.
    Timestamps are automatically managed.
    """
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'persons_person'
        ordering = ['last_name', 'first_name']


    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def __eq__(self, other):
        if isinstance(other, Person):
            return self.pk == other.pk
        return False

    def __hash__(self):
        return hash(self.pk)
