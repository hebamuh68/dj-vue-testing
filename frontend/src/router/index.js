import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Persons from '../views/Persons.vue'
import Weather from '../views/Weather.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/persons',
    name: 'Persons',
    component: Persons
  },
  {
    path: '/weather',
    name: 'Weather',
    component: Weather
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 