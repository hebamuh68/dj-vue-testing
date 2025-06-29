import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const apiService = {
  // Hello endpoints
  async getHello() {
    const response = await api.get('/hello/')
    return response.data
  },

  async getHelloPerson(lastName) {
    const response = await api.get(`/hello/${lastName}/`)
    return response.data
  },

  // Person endpoints
  async getPersons() {
    const response = await api.get('/hello/persons/')
    return response.data
  },

  async createPerson(personData) {
    const response = await api.post('/hello/persons/', personData)
    return response.data
  },

  async getPerson(id) {
    const response = await api.get(`/hello/persons/${id}/`)
    return response.data
  },

  async updatePerson(id, personData) {
    const response = await api.put(`/hello/persons/${id}/`, personData)
    return response.data
  },

  async deletePerson(id) {
    const response = await api.delete(`/hello/persons/${id}/`)
    return response.data
  },

  // Weather endpoint
  async getWeather() {
    const response = await api.get('/weather/')
    return response.data
  },
}

export default api 