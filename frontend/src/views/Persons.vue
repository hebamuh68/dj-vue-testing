<template>
  <div class="persons">
    <div class="card">
      <h1>Persons Management</h1>
      
      <!-- Add Person Form -->
      <div class="add-person-section">
        <h2>Add New Person</h2>
        <form @submit.prevent="addPerson" class="person-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">First Name:</label>
              <input 
                v-model="newPerson.first_name" 
                class="form-input" 
                placeholder="Enter first name"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Last Name:</label>
              <input 
                v-model="newPerson.last_name" 
                class="form-input" 
                placeholder="Enter last name"
                required
              />
            </div>
          </div>
          <button type="submit" :disabled="loading" class="btn">
            {{ loading ? 'Adding...' : 'Add Person' }}
          </button>
        </form>
      </div>

      <!-- Error/Success Messages -->
      <div v-if="error" class="error">
        {{ error }}
      </div>
      
      <div v-if="successMessage" class="success">
        {{ successMessage }}
      </div>

      <!-- Persons List -->
      <div class="persons-list">
        <h2>All Persons</h2>
        
        <div v-if="loading && persons.length === 0" class="loading">
          Loading persons...
        </div>
        
        <div v-else-if="persons.length === 0" class="no-persons">
          No persons found. Add some persons above!
        </div>
        
        <div v-else class="persons-grid">
          <div 
            v-for="person in persons" 
            :key="person.id" 
            class="person-card"
          >
            <div v-if="editingId === person.id" class="edit-form">
              <div class="form-group">
                <input 
                  v-model="editForm.first_name" 
                  class="form-input" 
                  placeholder="First name"
                />
              </div>
              <div class="form-group">
                <input 
                  v-model="editForm.last_name" 
                  class="form-input" 
                  placeholder="Last name"
                />
              </div>
              <div class="edit-actions">
                <button @click="saveEdit(person.id)" class="btn">Save</button>
                <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
              </div>
            </div>
            
            <div v-else class="person-info">
              <h3>{{ person.first_name }} {{ person.last_name }}</h3>
              <p class="person-id">ID: {{ person.id }}</p>
              <p class="person-dates">
                Created: {{ formatDate(person.created_at) }}
              </p>
              <div class="person-actions">
                <button @click="startEdit(person)" class="btn">Edit</button>
                <button 
                  @click="deletePerson(person.id)" 
                  class="btn btn-danger"
                  :disabled="loading"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usePersonsStore } from '../stores/persons'

export default {
  name: 'Persons',
  data() {
    return {
      newPerson: {
        first_name: '',
        last_name: '',
      },
      editingId: null,
      editForm: {
        first_name: '',
        last_name: '',
      },
      successMessage: '',
    }
  },
  computed: {
    personsStore() {
      return usePersonsStore()
    },
    persons() {
      return this.personsStore.persons
    },
    loading() {
      return this.personsStore.loading
    },
    error() {
      return this.personsStore.error
    },
  },
  async mounted() {
    await this.personsStore.fetchPersons()
  },
  methods: {
    async addPerson() {
      try {
        await this.personsStore.createPerson(this.newPerson)
        this.newPerson = { first_name: '', last_name: '' }
        this.successMessage = 'Person added successfully!'
        this.clearSuccessMessage()
      } catch (error) {
        console.error('Failed to add person:', error)
      }
    },

    startEdit(person) {
      this.editingId = person.id
      this.editForm = {
        first_name: person.first_name,
        last_name: person.last_name,
      }
    },

    cancelEdit() {
      this.editingId = null
      this.editForm = { first_name: '', last_name: '' }
    },

    async saveEdit(id) {
      try {
        const person = this.persons.find(p => p.id === id)
        const updatedData = {
          ...person,
          ...this.editForm,
        }
        await this.personsStore.updatePerson(id, updatedData)
        this.editingId = null
        this.successMessage = 'Person updated successfully!'
        this.clearSuccessMessage()
      } catch (error) {
        console.error('Failed to update person:', error)
      }
    },

    async deletePerson(id) {
      if (confirm('Are you sure you want to delete this person?')) {
        try {
          await this.personsStore.deletePerson(id)
          this.successMessage = 'Person deleted successfully!'
          this.clearSuccessMessage()
        } catch (error) {
          console.error('Failed to delete person:', error)
        }
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    },

    clearSuccessMessage() {
      setTimeout(() => {
        this.successMessage = ''
      }, 3000)
    },
  },
}
</script>

<style scoped>
.add-person-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.person-form .form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.persons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.person-card {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
}

.person-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.person-id,
.person-dates {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #6c757d;
}

.person-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.person-actions .btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.edit-form .form-group {
  margin-bottom: 0.5rem;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.no-persons {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}

@media (max-width: 768px) {
  .person-form .form-row {
    grid-template-columns: 1fr;
  }
  
  .persons-grid {
    grid-template-columns: 1fr;
  }
}
</style> 