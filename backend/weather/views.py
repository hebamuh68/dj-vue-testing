from django.http import JsonResponse
from rest_framework.decorators import api_view
from .client import WeatherClient


@api_view(['GET'])
def weather_summary(request):
    """
    Equivalent to Spring Boot's /weather endpoint.
    """
    client = WeatherClient()
    summary = client.get_weather_summary()
    
    if summary:
        return JsonResponse({"message": summary})
    else:
        return JsonResponse({
            "message": "Sorry, I couldn't fetch the weather for you :("
        }) 