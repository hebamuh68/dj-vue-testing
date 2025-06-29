import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '../../views/Home.vue'
import { apiService } from '../../services/api'

// Mock the API service
vi.mock('../../services/api')
const mockedApiService = vi.mocked(apiService)

describe('Home Component Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the home page correctly', () => {
    const wrapper = mount(Home)
    
    expect(wrapper.find('h1').text()).toBe('Django + Vue.js Testing Pyramid')
    expect(wrapper.find('.test-pyramid').exists()).toBe(true)
    expect(wrapper.findAll('.pyramid-level')).toHaveLength(3)
  })

  it('should display test pyramid levels', () => {
    const wrapper = mount(Home)
    
    const levels = wrapper.findAll('.pyramid-level')
    expect(levels[0].text()).toContain('End-to-End Tests')
    expect(levels[1].text()).toContain('Integration Tests')
    expect(levels[2].text()).toContain('Unit Tests')
  })

  describe('Hello World functionality', () => {
    it('should fetch and display hello message', async () => {
      mockedApiService.getHello.mockResolvedValue({ message: 'Hello World!' })
      
      const wrapper = mount(Home)
      const button = wrapper.find('.hello-section button')
      
      await button.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(mockedApiService.getHello).toHaveBeenCalled()
      expect(wrapper.find('.success').text()).toBe('Hello World!')
    })

    it('should handle hello API error', async () => {
      mockedApiService.getHello.mockRejectedValue(new Error('API Error'))
      
      const wrapper = mount(Home)
      const button = wrapper.find('.hello-section button')
      
      await button.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.error').text()).toBe('Failed to fetch hello message')
    })

    it('should show loading state during hello request', async () => {
      let resolvePromise
      const promise = new Promise(resolve => { resolvePromise = resolve })
      mockedApiService.getHello.mockReturnValue(promise)
      
      const wrapper = mount(Home)
      const button = wrapper.find('.hello-section button')
      
      await button.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(button.text()).toBe('Loading...')
      expect(button.attributes('disabled')).toBeDefined()
      
      resolvePromise({ message: 'Hello World!' })
      await wrapper.vm.$nextTick()
      
      expect(button.text()).toBe('Say Hello')
      expect(button.attributes('disabled')).toBeUndefined()
    })
  })

  describe('Hello Person functionality', () => {
    it('should fetch and display hello person message', async () => {
      mockedApiService.getHelloPerson.mockResolvedValue({ message: 'Hello John Doe!' })
      
      const wrapper = mount(Home)
      const input = wrapper.find('.hello-person-section input')
      const button = wrapper.find('.hello-person-section button')
      
      await input.setValue('Doe')
      await button.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(mockedApiService.getHelloPerson).toHaveBeenCalledWith('Doe')
      expect(wrapper.find('.hello-person-section .success').text()).toBe('Hello John Doe!')
    })

    it('should handle enter key press in input', async () => {
      mockedApiService.getHelloPerson.mockResolvedValue({ message: 'Hello Jane Smith!' })
      
      const wrapper = mount(Home)
      const input = wrapper.find('.hello-person-section input')
      
      await input.setValue('Smith')
      await input.trigger('keyup.enter')
      await wrapper.vm.$nextTick()
      
      expect(mockedApiService.getHelloPerson).toHaveBeenCalledWith('Smith')
    })

    it('should disable button when no last name is entered', () => {
      const wrapper = mount(Home)
      const button = wrapper.find('.hello-person-section button')
      
      expect(button.attributes('disabled')).toBeDefined()
    })

    it('should enable button when last name is entered', async () => {
      const wrapper = mount(Home)
      const input = wrapper.find('.hello-person-section input')
      const button = wrapper.find('.hello-person-section button')
      
      await input.setValue('Doe')
      await wrapper.vm.$nextTick()
      
      expect(button.attributes('disabled')).toBeUndefined()
    })

    it('should handle hello person API error', async () => {
      mockedApiService.getHelloPerson.mockRejectedValue(new Error('Person not found'))
      
      const wrapper = mount(Home)
      const input = wrapper.find('.hello-person-section input')
      const button = wrapper.find('.hello-person-section button')
      
      await input.setValue('NonExistent')
      await button.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.error').text()).toBe('Failed to fetch hello person message')
    })
  })

  describe('Component state management', () => {
    it('should clear error when making new requests', async () => {
      // First request fails
      mockedApiService.getHello.mockRejectedValueOnce(new Error('First error'))
      
      const wrapper = mount(Home)
      const button = wrapper.find('.hello-section button')
      
      await button.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.error').exists()).toBe(true)
      
      // Second request succeeds
      mockedApiService.getHello.mockResolvedValue({ message: 'Hello World!' })
      
      await button.trigger('click')
      await wrapper.vm.$nextTick()
      
      expect(wrapper.find('.error').exists()).toBe(false)
      expect(wrapper.find('.success').exists()).toBe(true)
    })
  })
}) 