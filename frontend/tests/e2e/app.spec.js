import { test, expect } from '@playwright/test'

test.describe('Django + Vue.js Testing Pyramid E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173')
  })

  test('should display the home page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Django \+ Vue\.js Testing Pyramid/)
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Django + Vue.js Testing Pyramid')
    
    // Check navigation
    await expect(page.locator('.nav-link')).toHaveCount(3)
    await expect(page.locator('.nav-link').first()).toContainText('Home')
    
    // Check test pyramid visualization
    await expect(page.locator('.pyramid-level')).toHaveCount(3)
    await expect(page.locator('.pyramid-level').first()).toContainText('End-to-End Tests')
  })

  test('should navigate between pages', async ({ page }) => {
    // Navigate to Persons page
    await page.click('text=Persons')
    await expect(page.locator('h1')).toContainText('Persons Management')
    
    // Navigate to Weather page
    await page.click('text=Weather')
    await expect(page.locator('h1')).toContainText('Weather Information')
    
    // Navigate back to Home
    await page.click('text=Home')
    await expect(page.locator('h1')).toContainText('Django + Vue.js Testing Pyramid')
  })

  test('should test hello world functionality', async ({ page }) => {
    // Mock the API response
    await page.route('/api/hello/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Hello World!' })
      })
    })
    
    // Click the Say Hello button
    await page.click('text=Say Hello')
    
    // Check that the response is displayed
    await expect(page.locator('.success')).toContainText('Hello World!')
  })

  test('should test hello person functionality', async ({ page }) => {
    // Mock the API response
    await page.route('/api/hello/Doe/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Hello John Doe!' })
      })
    })
    
    // Fill in the last name input
    await page.fill('input[placeholder="e.g., Doe"]', 'Doe')
    
    // Click the Say Hello to Person button
    await page.click('text=Say Hello to Person')
    
    // Check that the response is displayed
    await expect(page.locator('.hello-person-section .success')).toContainText('Hello John Doe!')
  })

  test('should test persons management', async ({ page }) => {
    // Navigate to Persons page
    await page.click('text=Persons')
    
    // Mock API responses
    await page.route('/api/hello/persons/', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            { id: 1, first_name: 'John', last_name: 'Doe', created_at: '2023-01-01T00:00:00Z' }
          ])
        })
      } else if (route.request().method() === 'POST') {
        const postData = route.request().postDataJSON()
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 2,
            ...postData,
            created_at: '2023-01-02T00:00:00Z'
          })
        })
      }
    })
    
    // Wait for persons to load
    await expect(page.locator('.person-card')).toHaveCount(1)
    await expect(page.locator('.person-card')).toContainText('John Doe')
    
    // Add a new person
    await page.fill('input[placeholder="Enter first name"]', 'Jane')
    await page.fill('input[placeholder="Enter last name"]', 'Smith')
    await page.click('text=Add Person')
    
    // Check success message
    await expect(page.locator('.success')).toContainText('Person added successfully!')
  })

  test('should test weather functionality', async ({ page }) => {
    // Navigate to Weather page
    await page.click('text=Weather')
    
    // Mock the weather API response
    await page.route('/api/weather/', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Weather in Hamburg: clear sky, 20.5°C' })
      })
    })
    
    // Click the Get Weather button
    await page.click('text=Get Weather')
    
    // Check that the weather information is displayed
    await expect(page.locator('.success')).toContainText('Weather in Hamburg: clear sky, 20.5°C')
  })

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error response
    await page.route('/api/hello/', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      })
    })
    
    // Click the Say Hello button
    await page.click('text=Say Hello')
    
    // Check that error is displayed
    await expect(page.locator('.error')).toContainText('Failed to fetch hello message')
  })

  test('should show loading states', async ({ page }) => {
    // Mock a delayed API response
    await page.route('/api/hello/', async route => {
      // Delay the response
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Hello World!' })
      })
    })
    
    // Click the Say Hello button
    await page.click('text=Say Hello')
    
    // Check loading state
    await expect(page.locator('button:has-text("Loading...")')).toBeVisible()
    
    // Wait for response and check final state
    await expect(page.locator('.success')).toContainText('Hello World!')
    await expect(page.locator('button:has-text("Say Hello")')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that navigation is still accessible
    await expect(page.locator('.nav-container')).toBeVisible()
    
    // Navigate to Persons page
    await page.click('text=Persons')
    
    // Check that the form is responsive
    await expect(page.locator('.person-form')).toBeVisible()
    
    // Check that cards stack vertically on mobile
    const personCards = page.locator('.person-card')
    if (await personCards.count() > 0) {
      const firstCard = personCards.first()
      const cardBox = await firstCard.boundingBox()
      expect(cardBox.width).toBeLessThan(400) // Should be narrow on mobile
    }
  })
}) 