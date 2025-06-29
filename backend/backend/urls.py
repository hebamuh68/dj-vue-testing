"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def hello_world(request):
    return JsonResponse({"message": "Hello World!"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/hello/', hello_world, name='hello_world'),
    path('api/hello/', include('persons.urls')),
    path('api/weather/', include('weather.urls')),
] 