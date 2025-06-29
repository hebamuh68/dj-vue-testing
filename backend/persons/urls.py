from django.urls import path
from . import views

app_name = 'persons'

urlpatterns = [
    path('persons/', views.person_list, name='person_list'),
    path('persons/<int:pk>/', views.person_detail, name='person_detail'),
    path('<str:last_name>/', views.hello_person, name='hello_person'),
] 