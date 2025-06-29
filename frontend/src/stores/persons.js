import { defineStore } from 'pinia'
import { apiService } from '../services/api'

export const usePersonsStore = defineStore('persons', {
  state: () => ({
    persons: [],
    loading: false,
    error: null,
  }),

  getters: {
    getPersonByLastName: (state) => (lastName) => {
      return state.persons.find(person => person.last_name === lastName)
    },
  },

  actions: {
    async fetchPersons() {
      this.loading = true
      this.error = null
      try {
        this.persons = await apiService.getPersons()
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch persons:', error)
      } finally {
        this.loading = false
      }
    },

    async createPerson(personData) {
      this.loading = true
      this.error = null
      try {
        const newPerson = await apiService.createPerson(personData)
        this.persons.push(newPerson)
        return newPerson
      } catch (error) {
        this.error = error.message
        console.error('Failed to create person:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updatePerson(id, personData) {
      this.loading = true
      this.error = null
      try {
        const updatedPerson = await apiService.updatePerson(id, personData)
        const index = this.persons.findIndex(p => p.id === id)
        if (index !== -1) {
          this.persons[index] = updatedPerson
        }
        return updatedPerson
      } catch (error) {
        this.error = error.message
        console.error('Failed to update person:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deletePerson(id) {
      this.loading = true
      this.error = null
      try {
        await apiService.deletePerson(id)
        this.persons = this.persons.filter(p => p.id !== id)
      } catch (error) {
        this.error = error.message
        console.error('Failed to delete person:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },
  },
}) 