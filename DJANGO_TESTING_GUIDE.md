# Comprehensive Django Testing Guide with pytest

## Table of Contents
1. [Introduction to Testing](#introduction-to-testing)
2. [Project Setup](#project-setup)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [Functional Testing](#functional-testing)
6. [Test Organization](#test-organization)
7. [Advanced Testing Techniques](#advanced-testing-techniques)
8. [Best Practices](#best-practices)
9. [Running Tests](#running-tests)

## Introduction to Testing

### What is Testing?
Testing is the process of verifying that your code works as expected. In Django applications, testing helps ensure:
- Your models behave correctly
- Your views return the right responses
- Your APIs work properly
- Your business logic is sound
- Changes don't break existing functionality

### Types of Tests

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test how components work together
3. **Functional Tests**: Test complete user workflows

### Why pytest?
- More readable test syntax
- Powerful fixtures
- Better error reporting
- Extensive plugin ecosystem
- Parallel test execution

## Project Setup

Your project already has the necessary testing dependencies:
- `pytest`: Testing framework
- `pytest-django`: Django integration for pytest
- `pytest-cov`: Code coverage reporting
- `factory-boy`: Test data generation
- `responses`: Mock HTTP requests
- `selenium`: Browser automation for functional tests

## Unit Testing

Unit tests verify individual components in isolation. They should be fast, reliable, and test one thing at a time.

### 1. Model Testing

Create `backend/tests/unit/test_models.py`:

```python
import pytest
from django.test import TestCase
from persons.models import Person
from datetime import datetime


class TestPersonModel:
    """Unit tests for Person model"""
    
    def test_person_creation(self):
        """Test creating a person instance"""
        person = Person.objects.create(
            first_name="John",
            last_name="Doe"
        )
        
        assert person.first_name == "John"
        assert person.last_name == "Doe"
        assert person.id is not None
        assert isinstance(person.created_at, datetime)
        assert isinstance(person.updated_at, datetime)
    
    def test_person_string_representation(self):
        """Test the __str__ method"""
        person = Person.objects.create(
            first_name="Jane",
            last_name="Smith"
        )
        
        assert str(person) == "Jane Smith"
    
    def test_person_equality(self):
        """Test the __eq__ method"""
        person1 = Person.objects.create(
            first_name="John",
            last_name="Doe"
        )
        person2 = Person.objects.create(
            first_name="John",
            last_name="Doe"
        )
        person3 = Person.objects.create(
            first_name="Jane",
            last_name="Doe"
        )
        
        # Same person (same ID)
        assert person1 == person1
        
        # Different persons with same data
        assert person1 != person2
        
        # Different persons with different data
        assert person1 != person3
    
    def test_person_ordering(self):
        """Test model ordering"""
        person1 = Person.objects.create(first_name="John", last_name="Doe")
        person2 = Person.objects.create(first_name="Jane", last_name="Smith")
        person3 = Person.objects.create(first_name="Bob", last_name="Adams")
        
        persons = Person.objects.all()
        
        # Should be ordered by last_name, then first_name
        assert list(persons) == [person3, person1, person2]
    
    def test_person_validation(self):
        """Test model field validation"""
        # Test max_length constraint
        with pytest.raises(Exception):
            Person.objects.create(
                first_name="A" * 101,  # Exceeds max_length=100
                last_name="Doe"
            )
```

### 2. Serializer Testing

Create `backend/tests/unit/test_serializers.py`:

```python
import pytest
from django.test import TestCase
from persons.serializers import PersonSerializer, PersonCreateSerializer
from persons.models import Person


class TestPersonSerializer:
    """Unit tests for Person serializers"""
    
    def test_person_serializer_valid_data(self):
        """Test serializing valid person data"""
        person = Person.objects.create(
            first_name="John",
            last_name="Doe"
        )
        serializer = PersonSerializer(person)
        
        data = serializer.data
        assert data['first_name'] == "John"
        assert data['last_name'] == "Doe"
        assert 'id' in data
        assert 'created_at' in data
        assert 'updated_at' in data
    
    def test_person_serializer_invalid_data(self):
        """Test serializing invalid person data"""
        invalid_data = {
            'first_name': '',  # Empty string
            'last_name': 'A' * 101  # Too long
        }
        serializer = PersonSerializer(data=invalid_data)
        
        assert not serializer.is_valid()
        assert 'first_name' in serializer.errors
        assert 'last_name' in serializer.errors
    
    def test_person_create_serializer_valid_data(self):
        """Test creating person with valid data"""
        valid_data = {
            'first_name': 'John',
            'last_name': 'Doe'
        }
        serializer = PersonCreateSerializer(data=valid_data)
        
        assert serializer.is_valid()
        person = serializer.save()
        
        assert person.first_name == 'John'
        assert person.last_name == 'Doe'
        assert person.id is not None
    
    def test_person_create_serializer_missing_fields(self):
        """Test creating person with missing required fields"""
        invalid_data = {
            'first_name': 'John'
            # Missing last_name
        }
        serializer = PersonCreateSerializer(data=invalid_data)
        
        assert not serializer.is_valid()
        assert 'last_name' in serializer.errors
```

### 3. Business Logic Testing

Create `backend/tests/unit/test_weather_client.py`:

```python
import pytest
from unittest.mock import patch, Mock
from weather.client import WeatherClient


class TestWeatherClient:
    """Unit tests for WeatherClient"""
    
    def test_weather_client_initialization(self):
        """Test WeatherClient initialization"""
        with patch('weather.client.settings') as mock_settings:
            mock_settings.WEATHER_API_KEY = 'test_key'
            mock_settings.WEATHER_API_URL = 'http://api.test.com'
            
            client = WeatherClient()
            
            assert client.api_key == 'test_key'
            assert client.base_url == 'http://api.test.com'
            assert client.CITY == 'Hamburg,de'
    
    @patch('weather.client.requests.get')
    def test_fetch_weather_success(self, mock_get):
        """Test successful weather data fetching"""
        mock_response = Mock()
        mock_response.json.return_value = {
            'weather': [{'description': 'sunny'}],
            'main': {'temp': 25},
            'name': 'Hamburg'
        }
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        with patch('weather.client.settings') as mock_settings:
            mock_settings.WEATHER_API_KEY = 'test_key'
            mock_settings.WEATHER_API_URL = 'http://api.test.com'
            
            client = WeatherClient()
            result = client.fetch_weather()
            
            assert result == {
                'weather': [{'description': 'sunny'}],
                'main': {'temp': 25},
                'name': 'Hamburg'
            }
            
            # Verify the request was made correctly
            mock_get.assert_called_once()
            call_args = mock_get.call_args
            assert call_args[0][0] == 'http://api.test.com/data/2.5/weather'
            assert call_args[1]['params']['q'] == 'Hamburg,de'
            assert call_args[1]['params']['appid'] == 'test_key'
            assert call_args[1]['params']['units'] == 'metric'
    
    @patch('weather.client.requests.get')
    def test_fetch_weather_failure(self, mock_get):
        """Test weather data fetching failure"""
        mock_get.side_effect = Exception("Network error")
        
        with patch('weather.client.settings') as mock_settings:
            mock_settings.WEATHER_API_KEY = 'test_key'
            mock_settings.WEATHER_API_URL = 'http://api.test.com'
            
            client = WeatherClient()
            result = client.fetch_weather()
            
            assert result is None
    
    def test_get_weather_summary_success(self):
        """Test successful weather summary generation"""
        weather_data = {
            'weather': [{'description': 'sunny'}],
            'main': {'temp': 25},
            'name': 'Hamburg'
        }
        
        with patch.object(WeatherClient, 'fetch_weather', return_value=weather_data):
            client = WeatherClient()
            summary = client.get_weather_summary()
            
            assert summary == "Weather in Hamburg: sunny, 25°C"
    
    def test_get_weather_summary_no_data(self):
        """Test weather summary with no data"""
        with patch.object(WeatherClient, 'fetch_weather', return_value=None):
            client = WeatherClient()
            summary = client.get_weather_summary()
            
            assert summary is None
    
    def test_get_weather_summary_invalid_data(self):
        """Test weather summary with invalid data structure"""
        invalid_weather_data = {
            'weather': [],  # Empty weather array
            'main': {},
            'name': 'Hamburg'
        }
        
        with patch.object(WeatherClient, 'fetch_weather', return_value=invalid_weather_data):
            client = WeatherClient()
            summary = client.get_weather_summary()
            
            assert summary is None
```

## Integration Testing

Integration tests verify how different components work together.

### 1. View Testing

Create `backend/tests/integration/test_views.py`:

```python
import pytest
import json
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from persons.models import Person


class TestPersonViews:
    """Integration tests for Person views"""
    
    @pytest.fixture
    def api_client(self):
        """Create API client for testing"""
        return APIClient()
    
    @pytest.fixture
    def sample_person(self):
        """Create a sample person for testing"""
        return Person.objects.create(
            first_name="John",
            last_name="Doe"
        )
    
    def test_hello_person_existing_person(self, api_client, sample_person):
        """Test hello endpoint with existing person"""
        url = reverse('hello_person', kwargs={'last_name': 'Doe'})
        response = api_client.get(url)
        
        assert response.status_code == 200
        data = json.loads(response.content)
        assert data['message'] == "Hello John Doe!"
    
    def test_hello_person_nonexistent_person(self, api_client):
        """Test hello endpoint with non-existent person"""
        url = reverse('hello_person', kwargs={'last_name': 'Nonexistent'})
        response = api_client.get(url)
        
        assert response.status_code == 200
        data = json.loads(response.content)
        assert data['message'] == "Who is this 'Nonexistent' you're talking about?"
    
    def test_person_list_get(self, api_client, sample_person):
        """Test GET person list endpoint"""
        url = reverse('person_list')
        response = api_client.get(url)
        
        assert response.status_code == 200
        data = response.data
        assert len(data) == 1
        assert data[0]['first_name'] == 'John'
        assert data[0]['last_name'] == 'Doe'
    
    def test_person_list_post_valid(self, api_client):
        """Test POST person list endpoint with valid data"""
        url = reverse('person_list')
        data = {
            'first_name': 'Jane',
            'last_name': 'Smith'
        }
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == 201
        assert response.data['first_name'] == 'Jane'
        assert response.data['last_name'] == 'Smith'
        
        # Verify person was created in database
        person = Person.objects.get(first_name='Jane')
        assert person.last_name == 'Smith'
    
    def test_person_list_post_invalid(self, api_client):
        """Test POST person list endpoint with invalid data"""
        url = reverse('person_list')
        data = {
            'first_name': '',  # Invalid: empty string
            'last_name': 'Smith'
        }
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == 400
        assert 'first_name' in response.data
    
    def test_person_detail_get(self, api_client, sample_person):
        """Test GET person detail endpoint"""
        url = reverse('person_detail', kwargs={'pk': sample_person.pk})
        response = api_client.get(url)
        
        assert response.status_code == 200
        data = response.data
        assert data['first_name'] == 'John'
        assert data['last_name'] == 'Doe'
    
    def test_person_detail_get_nonexistent(self, api_client):
        """Test GET person detail endpoint with non-existent person"""
        url = reverse('person_detail', kwargs={'pk': 999})
        response = api_client.get(url)
        
        assert response.status_code == 404
    
    def test_person_detail_put_valid(self, api_client, sample_person):
        """Test PUT person detail endpoint with valid data"""
        url = reverse('person_detail', kwargs={'pk': sample_person.pk})
        data = {
            'first_name': 'Jane',
            'last_name': 'Smith'
        }
        response = api_client.put(url, data, format='json')
        
        assert response.status_code == 200
        assert response.data['first_name'] == 'Jane'
        assert response.data['last_name'] == 'Smith'
        
        # Verify person was updated in database
        sample_person.refresh_from_db()
        assert sample_person.first_name == 'Jane'
        assert sample_person.last_name == 'Smith'
    
    def test_person_detail_delete(self, api_client, sample_person):
        """Test DELETE person detail endpoint"""
        url = reverse('person_detail', kwargs={'pk': sample_person.pk})
        response = api_client.delete(url)
        
        assert response.status_code == 204
        
        # Verify person was deleted from database
        assert not Person.objects.filter(pk=sample_person.pk).exists()
```


### 2. Weather View Testing

Create `backend/tests/integration/test_weather_views.py`:

```python
import pytest
import json
from unittest.mock import patch
from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse


class TestWeatherViews:
    """Integration tests for Weather views"""
    
    @pytest.fixture
    def api_client(self):
        """Create API client for testing"""
        return APIClient()
    
    @patch('weather.views.WeatherClient')
    def test_weather_summary_success(self, mock_weather_client, api_client):
        """Test weather summary endpoint with successful response"""
        # Mock the weather client
        mock_client_instance = mock_weather_client.return_value
        mock_client_instance.get_weather_summary.return_value = "Weather in Hamburg: sunny, 25°C"
        
        url = reverse('weather_summary')
        response = api_client.get(url)
        
        assert response.status_code == 200
        data = json.loads(response.content)
        assert data['message'] == "Weather in Hamburg: sunny, 25°C"
        
        # Verify WeatherClient was instantiated and called
        mock_weather_client.assert_called_once()
        mock_client_instance.get_weather_summary.assert_called_once()
    
    @patch('weather.views.WeatherClient')
    def test_weather_summary_failure(self, mock_weather_client, api_client):
        """Test weather summary endpoint with failed response"""
        # Mock the weather client to return None
        mock_client_instance = mock_weather_client.return_value
        mock_client_instance.get_weather_summary.return_value = None
        
        url = reverse('weather_summary')
        response = api_client.get(url)
        
        assert response.status_code == 200
        data = json.loads(response.content)
        assert data['message'] == "Sorry, I couldn't fetch the weather for you :("
```


## Functional Testing

Functional tests verify complete user workflows and simulate real user interactions.

### 1. API Functional Testing

Create `backend/tests/functional/test_api_workflows.py`:

```python
import pytest
import json
from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from persons.models import Person


class TestAPIFunctionalWorkflows:
    """Functional tests for API workflows"""
    
    @pytest.fixture
    def api_client(self):
        """Create API client for testing"""
        return APIClient()
    
    def test_complete_person_crud_workflow(self, api_client):
        """Test complete CRUD workflow for a person"""
        # 1. Create a person
        create_url = reverse('person_list')
        create_data = {
            'first_name': 'Alice',
            'last_name': 'Johnson'
        }
        create_response = api_client.post(create_url, create_data, format='json')
        
        assert create_response.status_code == 201
        person_id = create_response.data['id']
        
        # 2. Retrieve the person
        detail_url = reverse('person_detail', kwargs={'pk': person_id})
        get_response = api_client.get(detail_url)
        
        assert get_response.status_code == 200
        assert get_response.data['first_name'] == 'Alice'
        assert get_response.data['last_name'] == 'Johnson'
        
        # 3. Update the person
        update_data = {
            'first_name': 'Alice',
            'last_name': 'Smith'
        }
        update_response = api_client.put(detail_url, update_data, format='json')
        
        assert update_response.status_code == 200
        assert update_response.data['last_name'] == 'Smith'
        
        # 4. Verify the person is in the list
        list_url = reverse('person_list')
        list_response = api_client.get(list_url)
        
        assert list_response.status_code == 200
        assert len(list_response.data) == 1
        assert list_response.data[0]['last_name'] == 'Smith'
        
        # 5. Delete the person
        delete_response = api_client.delete(detail_url)
        
        assert delete_response.status_code == 204
        
        # 6. Verify the person is deleted
        get_after_delete_response = api_client.get(detail_url)
        assert get_after_delete_response.status_code == 404
        
        # 7. Verify the person is not in the list
        list_after_delete_response = api_client.get(list_url)
        assert list_after_delete_response.status_code == 200
        assert len(list_after_delete_response.data) == 0
    
    def test_multiple_persons_workflow(self, api_client):
        """Test workflow with multiple persons"""
        # Create multiple persons
        persons_data = [
            {'first_name': 'John', 'last_name': 'Doe'},
            {'first_name': 'Jane', 'last_name': 'Smith'},
            {'first_name': 'Bob', 'last_name': 'Johnson'}
        ]
        
        created_persons = []
        for person_data in persons_data:
            response = api_client.post(reverse('person_list'), person_data, format='json')
            assert response.status_code == 201
            created_persons.append(response.data)
        
        # Verify all persons are in the list
        list_response = api_client.get(reverse('person_list'))
        assert list_response.status_code == 200
        assert len(list_response.data) == 3
        
        # Test hello endpoint for each person
        for person in created_persons:
            hello_url = reverse('hello_person', kwargs={'last_name': person['last_name']})
            hello_response = api_client.get(hello_url)
            assert hello_response.status_code == 200
            data = json.loads(hello_response.content)
            expected_message = f"Hello {person['first_name']} {person['last_name']}!"
            assert data['message'] == expected_message
    
    def test_error_handling_workflow(self, api_client):
        """Test error handling in API workflows"""
        # Test creating person with invalid data
        invalid_data = {
            'first_name': '',  # Invalid: empty string
            'last_name': 'A' * 101  # Invalid: too long
        }
        create_response = api_client.post(reverse('person_list'), invalid_data, format='json')
        assert create_response.status_code == 400
        assert 'first_name' in create_response.data
        assert 'last_name' in create_response.data
        
        # Test updating non-existent person
        update_url = reverse('person_detail', kwargs={'pk': 999})
        update_data = {'first_name': 'John', 'last_name': 'Doe'}
        update_response = api_client.put(update_url, update_data, format='json')
        assert update_response.status_code == 404
        
        # Test deleting non-existent person
        delete_response = api_client.delete(update_url)
        assert delete_response.status_code == 404
        
        # Test hello endpoint with non-existent person
        hello_response = api_client.get(reverse('hello_person', kwargs={'last_name': 'Nonexistent'}))
        assert hello_response.status_code == 200
        data = json.loads(hello_response.content)
        assert data['message'] == "Who is this 'Nonexistent' you're talking about?"
```


### 2. Browser-based Functional Testing

Create `backend/tests/functional/test_browser_workflows.py`:

```python
import pytest
from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from persons.models import Person


class TestBrowserFunctionalWorkflows(LiveServerTestCase):
    """Browser-based functional tests"""
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Setup Chrome driver
        service = Service(ChromeDriverManager().install())
        cls.driver = webdriver.Chrome(service=service)
        cls.driver.implicitly_wait(10)
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
        super().tearDownClass()
    
    def setUp(self):
        """Set up test data"""
        self.person = Person.objects.create(
            first_name="John",
            last_name="Doe"
        )
    
    def test_api_endpoints_accessible(self):
        """Test that API endpoints are accessible via browser"""
        # Test persons list endpoint
        self.driver.get(f"{self.live_server_url}/api/persons/")
        
        # Wait for JSON response
        wait = WebDriverWait(self.driver, 10)
        body = wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        
        # Verify JSON response contains our person
        response_text = body.text
        assert "John" in response_text
        assert "Doe" in response_text
    
    def test_hello_endpoint_accessible(self):
        """Test hello endpoint is accessible via browser"""
        self.driver.get(f"{self.live_server_url}/api/hello/Doe/")
        
        wait = WebDriverWait(self.driver, 10)
        body = wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        
        response_text = body.text
        assert "Hello John Doe!" in response_text
    
    def test_weather_endpoint_accessible(self):
        """Test weather endpoint is accessible via browser"""
        self.driver.get(f"{self.live_server_url}/api/weather/")
        
        wait = WebDriverWait(self.driver, 10)
        body = wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        
        response_text = body.text
        # Should contain either weather data or error message
        assert "Weather in" in response_text or "Sorry" in response_text
```


## Test Organization

### Directory Structure
```
backend/tests/
├── __init__.py
├── unit/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_serializers.py
│   └── test_weather_client.py
├── integration/
│   ├── __init__.py
│   ├── test_views.py
│   └── test_weather_views.py
└── functional/
    ├── __init__.py
    ├── test_api_workflows.py
    └── test_browser_workflows.py
```

### Test Configuration

Your `pytest.ini` is already well-configured with:
- Django settings module
- Test file patterns
- Coverage reporting
- Custom markers

## Advanced Testing Techniques

### 1. Fixtures

Create `backend/tests/conftest.py`:

```python
import pytest
from django.test import TestCase
from rest_framework.test import APIClient
from persons.models import Person
from factory import Factory, Faker


class PersonFactory(Factory):
    """Factory for creating Person instances"""
    class Meta:
        model = Person
    
    first_name = Faker('first_name')
    last_name = Faker('last_name')


@pytest.fixture
def api_client():
    """Provide API client for tests"""
    return APIClient()


@pytest.fixture
def sample_person():
    """Provide a sample person for tests"""
    return PersonFactory()


@pytest.fixture
def multiple_persons():
    """Provide multiple sample persons for tests"""
    return PersonFactory.create_batch(3)


@pytest.fixture
def authenticated_client(api_client):
    """Provide authenticated API client (if you add authentication later)"""
    # Add authentication logic here when you implement it
    return api_client
```

### 2. Parameterized Tests

```python
import pytest
from persons.models import Person


@pytest.mark.parametrize("first_name,last_name,expected_full_name", [
    ("John", "Doe", "John Doe"),
    ("Jane", "Smith", "Jane Smith"),
    ("Bob", "Johnson", "Bob Johnson"),
])
def test_person_full_name(first_name, last_name, expected_full_name):
    """Test person full name with different inputs"""
    person = Person.objects.create(
        first_name=first_name,
        last_name=last_name
    )
    assert str(person) == expected_full_name
```

### 3. Mocking External Services

```python
import pytest
from unittest.mock import patch
from weather.client import WeatherClient


@pytest.fixture
def mock_weather_api():
    """Mock weather API responses"""
    with patch('weather.client.requests.get') as mock_get:
        yield mock_get


def test_weather_client_with_mock(mock_weather_api):
    """Test weather client with mocked API"""
    # Configure mock response
    mock_response = Mock()
    mock_response.json.return_value = {
        'weather': [{'description': 'sunny'}],
        'main': {'temp': 25},
        'name': 'Hamburg'
    }
    mock_response.raise_for_status.return_value = None
    mock_weather_api.return_value = mock_response
    
    # Test the client
    client = WeatherClient()
    result = client.fetch_weather()
    
    assert result is not None
    assert result['name'] == 'Hamburg'
```

## Best Practices

### 1. Test Naming
- Use descriptive test names that explain what is being tested
- Follow the pattern: `test_[method_name]_[scenario]`
- Example: `test_person_creation_with_valid_data`

### 2. Test Structure (AAA Pattern)
```python
def test_example():
    # Arrange - Set up test data
    person = PersonFactory()
    
    # Act - Perform the action being tested
    result = person.get_full_name()
    
    # Assert - Verify the result
    assert result == f"{person.first_name} {person.last_name}"
```

### 3. Test Isolation
- Each test should be independent
- Use `setUp` and `tearDown` methods
- Use database transactions for test isolation

### 4. Test Data Management
- Use factories for creating test data
- Avoid hardcoded test data
- Use realistic but minimal test data

### 5. Error Testing
- Always test error conditions
- Test edge cases
- Test invalid inputs

## Running Tests

### Basic Commands

```bash
# Run all tests
pytest

# Run tests with coverage
pytest --cov=backend

# Run specific test file
pytest backend/tests/unit/test_models.py

# Run specific test function
pytest backend/tests/unit/test_models.py::TestPersonModel::test_person_creation

# Run tests by marker
pytest -m unit
pytest -m integration
pytest -m functional

# Run tests in parallel
pytest -n auto

# Run tests with verbose output
pytest -v

# Run tests and stop on first failure
pytest -x
```

### Test Execution Order

1. **Unit Tests**: Fast, isolated tests
2. **Integration Tests**: Tests component interactions
3. **Functional Tests**: End-to-end workflow tests

### Continuous Integration

Add to your CI pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    cd backend
    pytest --cov=backend --cov-report=xml
    coverage report --fail-under=80
```

## Next Steps

1. **Implement the test files** following the structure above
2. **Add more test cases** for edge cases and error conditions
3. **Set up continuous integration** to run tests automatically
4. **Add performance tests** for slow operations
5. **Implement test data factories** for complex objects
6. **Add API documentation tests** using tools like drf-spectacular

## Common Issues and Solutions

### 1. Database Issues
- Use `@pytest.mark.django_db` for tests that need database access
- Use `TransactionTestCase` for tests that need transaction control

### 2. Time-dependent Tests
- Mock time-related functions
- Use fixed timestamps for testing

### 3. External API Tests
- Always mock external API calls
- Use `responses` library for HTTP mocking
- Test both success and failure scenarios

### 4. Slow Tests
- Use `@pytest.mark.slow` for slow tests
- Run slow tests separately in CI
- Use parallel execution for unit tests

This comprehensive guide should give you a solid foundation for testing your Django application with pytest. Start with unit tests and gradually add integration and functional tests as your application grows. 