<template>
  <div class="home">
    <div class="card">
      <h1>Django + Vue.js Testing Pyramid</h1>
      <p>
        This application demonstrates the practical test pyramid using Django as the backend
        and Vue.js as the frontend. It shows different levels of testing:
      </p>
      
      <div class="test-pyramid">
        <div class="pyramid-level e2e">
          <h3>End-to-End Tests</h3>
          <p>Full application testing with Playwright</p>
        </div>
        <div class="pyramid-level integration">
          <h3>Integration Tests</h3>
          <p>API endpoints and component integration</p>
        </div>
        <div class="pyramid-level unit">
          <h3>Unit Tests</h3>
          <p>Individual functions and components</p>
        </div>
      </div>

      <div class="hello-section">
        <h2>Hello World API</h2>
        <button @click="fetchHello" :disabled="loading" class="btn">
          {{ loading ? 'Loading...' : 'Say Hello' }}
        </button>
        
        <div v-if="helloMessage" class="success">
          {{ helloMessage }}
        </div>
        
        <div v-if="error" class="error">
          {{ error }}
        </div>
      </div>

      <div class="hello-person-section">
        <h2>Hello Person</h2>
        <div class="form-group">
          <label class="form-label">Enter Last Name:</label>
          <input 
            v-model="lastName" 
            @keyup.enter="fetchHelloPerson"
            class="form-input" 
            placeholder="e.g., Doe"
          />
        </div>
        <button @click="fetchHelloPerson" :disabled="loading || !lastName" class="btn">
          {{ loading ? 'Loading...' : 'Say Hello to Person' }}
        </button>
        
        <div v-if="helloPersonMessage" class="success">
          {{ helloPersonMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from '../services/api'

export default {
  name: 'Home',
  data() {
    return {
      helloMessage: '',
      helloPersonMessage: '',
      lastName: '',
      loading: false,
      error: null,
    }
  },
  methods: {
    async fetchHello() {
      this.loading = true
      this.error = null
      try {
        const response = await apiService.getHello()
        this.helloMessage = response.message
      } catch (error) {
        this.error = 'Failed to fetch hello message'
        console.error('Error fetching hello:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchHelloPerson() {
      if (!this.lastName) return
      
      this.loading = true
      this.error = null
      try {
        const response = await apiService.getHelloPerson(this.lastName)
        this.helloPersonMessage = response.message
      } catch (error) {
        this.error = 'Failed to fetch hello person message'
        console.error('Error fetching hello person:', error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.test-pyramid {
  margin: 2rem 0;
}

.pyramid-level {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}

.pyramid-level.e2e {
  background-color: #e8f5e8;
  border: 2px solid #4caf50;
}

.pyramid-level.integration {
  background-color: #fff3cd;
  border: 2px solid #ffc107;
}

.pyramid-level.unit {
  background-color: #d1ecf1;
  border: 2px solid #17a2b8;
}

.pyramid-level h3 {
  margin: 0 0 0.5rem 0;
}

.pyramid-level p {
  margin: 0;
  font-size: 0.9rem;
}

.hello-section,
.hello-person-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.hello-person-section .form-group {
  max-width: 300px;
}
</style> 