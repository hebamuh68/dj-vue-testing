# Django + Vue.js Full-Stack Testing Project

[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://python.org)
[![Django](https://img.shields.io/badge/Django-4.2+-green.svg)](https://djangoproject.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.0+-4FC08D.svg)](https://vuejs.org)
[![Pytest](https://img.shields.io/badge/Pytest-7.4+-orange.svg)](https://pytest.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive full-stack web application demonstrating modern testing practices with Django backend and Vue.js frontend. This project showcases the **Test Pyramid** approach with unit, integration, and functional tests.

## 🏗️ Project Architecture

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Vue.js        │ ←────────────→ │   Django        │ ←────────────→ │   PostgreSQL    │
│   Frontend      │                │   Backend       │                │   Database      │
│                 │                │                 │                │                 │
│ • Components    │                │ • REST API      │                │ • Person Data   │
│ • State Mgmt    │                │ • Models        │                │ • Weather Data  │
│ • Routing       │                │ • Serializers   │                │                 │
│ • Testing       │                │ • Testing       │                │                 │
└─────────────────┘                └─────────────────┘                └─────────────────┘
         │                                   │                                   │
         │                                   │                                   │
         └─────────── E2E Tests ─────────────┴─────────── Integration ──────────┘
```

## 🧪 Testing Strategy

This project implements the **Test Pyramid** with comprehensive testing at all levels:

```
      ╱╲
  E2E Tests
    ╱────╲
   ╱ Inte-╲
  ╱ gration╲
 ╱──────────╲
╱   Unit     ╲
──────────────
```

### Test Types

| Test Level | Location | Purpose | Tools |
|------------|----------|---------|-------|
| **Unit Tests** | `backend/tests/unit/` | Test individual functions, models, serializers | pytest, factory-boy |
| **Integration Tests** | `backend/tests/integration/` | Test API endpoints, database interactions | pytest-django, APIClient |
| **Functional Tests** | `backend/tests/functional/` | Test user workflows, admin interface | pytest-django, Selenium |
| **Frontend Tests** | `frontend/src/tests/` | Test Vue components and stores | Vitest, Vue Test Utils |

## 🚀 Quick Start

### Prerequisites

- **Python 3.12+**
- **Node.js 18+**
- **PostgreSQL** (or SQLite for development)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/hebamuh68/dj-vue-testing.git
cd dj-vue-testing
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API settings

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Run Tests

```bash
# Backend tests
cd backend
python -m pytest tests/ -v

# Frontend tests
cd frontend
npm run test

# Run with coverage
python -m pytest tests/ --cov=persons --cov-report=html
```

## 📁 Project Structure

```
dj-vue-testing/
├── backend/                    # Django Backend
│   ├── backend/               # Django project settings
│   │   ├── backend/          # Django project settings
│   │   ├── persons/          # Persons app
│   │   │   ├── models.py     # Person model
│   │   │   ├── serializers.py # DRF serializers
│   │   │   ├── views.py      # API views
│   │   │   └── tests/        # App-specific tests
│   │   ├── weather/          # Weather app
│   │   ├── tests/            # Test suite
│   │   │   ├── unit/         # Unit tests
│   │   │   ├── integration/  # Integration tests
│   │   │   ├── functional/   # Functional tests
│   │   │   └── conftest.py   # Shared fixtures
│   │   ├── requirements.txt  # Python dependencies
│   │   └── pytest.ini       # Pytest configuration
│   ├── frontend/             # Vue.js Frontend
│   │   ├── src/
│   │   │   ├── components/   # Vue components
│   │   │   ├── views/        # Page components
│   │   │   ├── stores/       # Pinia stores
│   │   │   ├── services/     # API services
│   │   │   └── tests/        # Frontend tests
│   │   ├── package.json      # Node dependencies
│   │   └── vite.config.js    # Vite configuration
│   ├── requirements.txt        # Root dependencies
│   └── README.md             # This file
```

## 🧪 Testing Examples

### Unit Tests (Models)

```python
# backend/tests/unit/test_models.py
def test_person_str(sample_person):
    """Test string representation of Person model."""
    expected_str = f"{sample_person.first_name} {sample_person.last_name}"
    assert str(sample_person) == expected_str
```

### Integration Tests (API)

```python
# backend/tests/integration/test_api.py
def test_person_list_api(api_client, multiple_persons):
    """Test person list API endpoint."""
    response = api_client.get('/api/persons/')
    assert response.status_code == 200
    assert len(response.data) == len(multiple_persons)
```

### Functional Tests (User Workflows)

```python
# backend/tests/functional/test_user_flows.py
def test_create_person_workflow(api_client):
    """Test complete person creation workflow."""
    data = {'first_name': 'John', 'last_name': 'Doe'}
    response = api_client.post('/api/persons/', data)
    assert response.status_code == 201
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```bash
# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# Weather API
WEATHER_API_KEY=your_openweathermap_api_key
WEATHER_API_URL=https://api.openweathermap.org

# Django
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Database Setup

For PostgreSQL:

```bash
# Using Docker
docker run --name postgres-testing \
  -e POSTGRES_DB=testdb \
  -e POSTGRES_USER=testuser \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Or use the provided script
./startDatabase.sh
```

## 📊 API Endpoints

### Persons API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/persons/` | List all persons |
| `POST` | `/api/persons/` | Create a new person |
| `GET` | `/api/persons/{id}/` | Get person details |
| `PUT` | `/api/persons/{id}/` | Update person |
| `DELETE` | `/api/persons/{id}/` | Delete person |

### Weather API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/weather/` | Get current weather |

## 🛠️ Development Tools

### Backend Tools

- **Django 4.2+** - Web framework
- **Django REST Framework** - API framework
- **Pytest** - Testing framework
- **Factory Boy** - Test data generation
- **Coverage** - Code coverage
- **Black** - Code formatting
- **Flake8** - Linting

### Frontend Tools

- **Vue.js 3** - Frontend framework
- **Vite** - Build tool
- **Pinia** - State management
- **Vue Router** - Routing
- **Vitest** - Testing framework
- **ESLint** - Linting
- **Prettier** - Code formatting

## 🚀 Deployment

### Backend Deployment

```bash
# Production settings
export DJANGO_SETTINGS_MODULE=backend.settings.production
export DEBUG=False

# Collect static files
python manage.py collectstatic

# Run migrations
python manage.py migrate

# Start with Gunicorn
gunicorn backend.wsgi:application
```

### Frontend Deployment

```bash
# Build for production
npm run build

# Serve with nginx or similar
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Testing Guidelines

- Write tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Follow the test pyramid approach
- Use fixtures for test data

## 📚 Learning Resources

- [Django Testing Documentation](https://docs.djangoproject.com/en/stable/topics/testing/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Vue.js Testing Guide](https://vuejs.org/guide/scaling-up/testing.html)
- [Test Pyramid by Martin Fowler](https://martinfowler.com/articles/practical-test-pyramid.html)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the [Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)
- Built with modern Django and Vue.js best practices
- Comprehensive testing examples for full-stack development

---

**Happy Testing! 🧪✨**

