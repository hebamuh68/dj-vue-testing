import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePersonsStore } from '../../stores/persons'
import { apiService } from '../../services/api'

// Mock the API service
vi.mock('../../services/api')
const mockedApiService = vi.mocked(apiService)

describe('Persons Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial state', () => {
    it('should have correct initial state', () => {
      const store = usePersonsStore()
      
      expect(store.persons).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('Getters', () => {
    it('should find person by last name', () => {
      const store = usePersonsStore()
      store.persons = [
        { id: 1, first_name: 'John', last_name: 'Doe' },
        { id: 2, first_name: 'Jane', last_name: 'Smith' }
      ]

      const person = store.getPersonByLastName('Doe')
      expect(person).toEqual({ id: 1, first_name: 'John', last_name: 'Doe' })
    })

    it('should return undefined for non-existing person', () => {
      const store = usePersonsStore()
      store.persons = [
        { id: 1, first_name: 'John', last_name: 'Doe' }
      ]

      const person = store.getPersonByLastName('NonExistent')
      expect(person).toBeUndefined()
    })
  })

  describe('Actions', () => {
    describe('fetchPersons', () => {
      it('should fetch persons successfully', async () => {
        const mockPersons = [
          { id: 1, first_name: 'John', last_name: 'Doe' },
          { id: 2, first_name: 'Jane', last_name: 'Smith' }
        ]
        mockedApiService.getPersons.mockResolvedValue(mockPersons)

        const store = usePersonsStore()
        await store.fetchPersons()

        expect(store.persons).toEqual(mockPersons)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('should handle fetch error', async () => {
        const error = new Error('Network error')
        mockedApiService.getPersons.mockRejectedValue(error)

        const store = usePersonsStore()
        await store.fetchPersons()

        expect(store.persons).toEqual([])
        expect(store.loading).toBe(false)
        expect(store.error).toBe('Network error')
      })
    })

    describe('createPerson', () => {
      it('should create person successfully', async () => {
        const newPersonData = { first_name: 'Alice', last_name: 'Wonder' }
        const createdPerson = { id: 3, ...newPersonData }
        mockedApiService.createPerson.mockResolvedValue(createdPerson)

        const store = usePersonsStore()
        const result = await store.createPerson(newPersonData)

        expect(result).toEqual(createdPerson)
        expect(store.persons).toContain(createdPerson)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('should handle create error', async () => {
        const error = new Error('Validation error')
        mockedApiService.createPerson.mockRejectedValue(error)

        const store = usePersonsStore()
        
        await expect(store.createPerson({})).rejects.toThrow('Validation error')
        expect(store.loading).toBe(false)
        expect(store.error).toBe('Validation error')
      })
    })

    describe('updatePerson', () => {
      it('should update person successfully', async () => {
        const existingPerson = { id: 1, first_name: 'John', last_name: 'Doe' }
        const updatedPerson = { id: 1, first_name: 'Jane', last_name: 'Doe' }
        mockedApiService.updatePerson.mockResolvedValue(updatedPerson)

        const store = usePersonsStore()
        store.persons = [existingPerson]
        
        const result = await store.updatePerson(1, updatedPerson)

        expect(result).toEqual(updatedPerson)
        expect(store.persons[0]).toEqual(updatedPerson)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('should handle update error', async () => {
        const error = new Error('Update failed')
        mockedApiService.updatePerson.mockRejectedValue(error)

        const store = usePersonsStore()
        
        await expect(store.updatePerson(1, {})).rejects.toThrow('Update failed')
        expect(store.loading).toBe(false)
        expect(store.error).toBe('Update failed')
      })
    })

    describe('deletePerson', () => {
      it('should delete person successfully', async () => {
        const person = { id: 1, first_name: 'John', last_name: 'Doe' }
        mockedApiService.deletePerson.mockResolvedValue(null)

        const store = usePersonsStore()
        store.persons = [person]
        
        await store.deletePerson(1)

        expect(store.persons).toEqual([])
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('should handle delete error', async () => {
        const error = new Error('Delete failed')
        mockedApiService.deletePerson.mockRejectedValue(error)

        const store = usePersonsStore()
        
        await expect(store.deletePerson(1)).rejects.toThrow('Delete failed')
        expect(store.loading).toBe(false)
        expect(store.error).toBe('Delete failed')
      })
    })

    describe('clearError', () => {
      it('should clear error', () => {
        const store = usePersonsStore()
        store.error = 'Some error'
        
        store.clearError()
        
        expect(store.error).toBeNull()
      })
    })
  })
}) 