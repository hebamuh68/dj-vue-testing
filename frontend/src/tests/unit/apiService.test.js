import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { apiService } from '../../services/api'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('API Service', () => {
  beforeEach(() => {
    mockedAxios.create.mockReturnValue(mockedAxios)
    mockedAxios.interceptors = {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Hello endpoints', () => {
    it('should fetch hello message', async () => {
      const mockResponse = { data: { message: 'Hello World!' } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await apiService.getHello()

      expect(mockedAxios.get).toHaveBeenCalledWith('/hello/')
      expect(result).toEqual({ message: 'Hello World!' })
    })

    it('should fetch hello person message', async () => {
      const mockResponse = { data: { message: 'Hello John Doe!' } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await apiService.getHelloPerson('Doe')

      expect(mockedAxios.get).toHaveBeenCalledWith('/hello/Doe/')
      expect(result).toEqual({ message: 'Hello John Doe!' })
    })
  })

  describe('Person endpoints', () => {
    it('should fetch persons list', async () => {
      const mockPersons = [
        { id: 1, first_name: 'John', last_name: 'Doe' },
        { id: 2, first_name: 'Jane', last_name: 'Smith' }
      ]
      const mockResponse = { data: mockPersons }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await apiService.getPersons()

      expect(mockedAxios.get).toHaveBeenCalledWith('/hello/persons/')
      expect(result).toEqual(mockPersons)
    })

    it('should create a new person', async () => {
      const newPerson = { first_name: 'Alice', last_name: 'Wonder' }
      const mockResponse = { data: { id: 3, ...newPerson } }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await apiService.createPerson(newPerson)

      expect(mockedAxios.post).toHaveBeenCalledWith('/hello/persons/', newPerson)
      expect(result).toEqual({ id: 3, ...newPerson })
    })

    it('should get a specific person', async () => {
      const mockPerson = { id: 1, first_name: 'John', last_name: 'Doe' }
      const mockResponse = { data: mockPerson }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await apiService.getPerson(1)

      expect(mockedAxios.get).toHaveBeenCalledWith('/hello/persons/1/')
      expect(result).toEqual(mockPerson)
    })

    it('should update a person', async () => {
      const updatedPerson = { id: 1, first_name: 'Jane', last_name: 'Doe' }
      const mockResponse = { data: updatedPerson }
      mockedAxios.put.mockResolvedValue(mockResponse)

      const result = await apiService.updatePerson(1, updatedPerson)

      expect(mockedAxios.put).toHaveBeenCalledWith('/hello/persons/1/', updatedPerson)
      expect(result).toEqual(updatedPerson)
    })

    it('should delete a person', async () => {
      const mockResponse = { data: null }
      mockedAxios.delete.mockResolvedValue(mockResponse)

      const result = await apiService.deletePerson(1)

      expect(mockedAxios.delete).toHaveBeenCalledWith('/hello/persons/1/')
      expect(result).toBeNull()
    })
  })

  describe('Weather endpoint', () => {
    it('should fetch weather information', async () => {
      const mockResponse = { data: { message: 'Weather in Hamburg: clear sky, 20°C' } }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await apiService.getWeather()

      expect(mockedAxios.get).toHaveBeenCalledWith('/weather/')
      expect(result).toEqual({ message: 'Weather in Hamburg: clear sky, 20°C' })
    })
  })

  describe('Error handling', () => {
    it('should handle API errors', async () => {
      const error = new Error('Network Error')
      mockedAxios.get.mockRejectedValue(error)

      await expect(apiService.getHello()).rejects.toThrow('Network Error')
    })
  })
}) 