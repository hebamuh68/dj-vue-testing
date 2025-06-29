<template>
  <div class="weather">
    <div class="card">
      <h1>Weather Information</h1>
      <p>
        Get current weather information for Hamburg, Germany from the OpenWeatherMap API.
      </p>

      <div class="weather-section">
        <button @click="fetchWeather" :disabled="loading" class="btn">
          {{ loading ? 'Loading...' : 'Get Weather' }}
        </button>
        
        <div v-if="weatherMessage" class="weather-result">
          <div class="success">
            {{ weatherMessage }}
          </div>
        </div>
        
        <div v-if="error" class="error">
          {{ error }}
        </div>

        <div v-if="!weatherMessage && !loading && !error" class="weather-placeholder">
          <p>Click the button above to fetch current weather information.</p>
        </div>
      </div>

      <div class="weather-info">
        <h2>About Weather API</h2>
        <p>
          This endpoint demonstrates external API integration by calling the OpenWeatherMap API
          to fetch real-time weather data. The implementation includes:
        </p>
        <ul>
          <li>HTTP client configuration</li>
          <li>Error handling for API failures</li>
          <li>Response parsing and formatting</li>
          <li>Timeout handling</li>
        </ul>
        
        <div class="api-details">
          <h3>Testing Considerations</h3>
          <ul>
            <li><strong>Unit Tests:</strong> Mock the HTTP client to test response parsing</li>
            <li><strong>Integration Tests:</strong> Use test doubles to simulate API responses</li>
            <li><strong>E2E Tests:</strong> Test the full user interaction flow</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from '../services/api'

export default {
  name: 'Weather',
  data() {
    return {
      weatherMessage: '',
      loading: false,
      error: null,
    }
  },
  methods: {
    async fetchWeather() {
      this.loading = true
      this.error = null
      this.weatherMessage = ''
      
      try {
        const response = await apiService.getWeather()
        this.weatherMessage = response.message
      } catch (error) {
        this.error = 'Failed to fetch weather information. Please try again.'
        console.error('Error fetching weather:', error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.weather-section {
  margin: 2rem 0;
  text-align: center;
}

.weather-result {
  margin-top: 2rem;
}

.weather-placeholder {
  margin-top: 2rem;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
  font-style: italic;
}

.weather-info {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.weather-info h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.weather-info ul {
  margin: 1rem 0;
  padding-left: 2rem;
}

.weather-info li {
  margin: 0.5rem 0;
}

.api-details {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.api-details h3 {
  margin-top: 0;
  color: #2c3e50;
}

.api-details strong {
  color: #2c3e50;
}
</style> 