import requests
from django.conf import settings
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)


class WeatherClient:
    """
    Weather API client equivalent to Spring Boot's WeatherClient.
    """
    CITY = "Hamburg,de"
    
    def __init__(self):
        self.api_key = settings.WEATHER_API_KEY
        self.base_url = settings.WEATHER_API_URL
    
    def fetch_weather(self) -> Optional[Dict[str, Any]]:
        """
        Fetch weather data from OpenWeatherMap API.
        Returns weather data or None if request fails.
        """
        if not self.api_key:
            logger.warning("Weather API key not configured")
            return None
            
        url = f"{self.base_url}/data/2.5/weather"
        params = {
            'q': self.CITY,
            'appid': self.api_key,
            'units': 'metric'
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch weather data: {e}")
            return None
    
    def get_weather_summary(self) -> Optional[str]:
        """
        Get a formatted weather summary.
        """
        weather_data = self.fetch_weather()
        if not weather_data:
            return None
            
        try:
            description = weather_data['weather'][0]['description']
            temp = weather_data['main']['temp']
            city = weather_data['name']
            return f"Weather in {city}: {description}, {temp}°C"
        except (KeyError, IndexError) as e:
            logger.error(f"Failed to parse weather data: {e}")
            return None 