<template>
  <v-container class="mt-8 max-width-1200 animate-fade-in">

    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h1 class="text-h3 font-weight-bold mb-2">Platform <span class="text-gradient">Admin</span></h1>
        <p class="text-h6 text-medium-emphasis">Manage knowledge base and user roles.</p>
      </div>
    </div>

    <v-row>
      <!-- Upload Document Section -->
      <v-col cols="12" md="5">
        <v-card class="pa-6 h-100" elevation="1">
          <h3 class="text-h5 font-weight-bold mb-6">Upload Document</h3>
          
          <v-form @submit.prevent="uploadDocument">
            <v-text-field
              label="Document Title (Optional)"
              v-model="title"
              variant="outlined"
              color="primary"
              class="mb-4"
              placeholder="e.g. Architecture Guidelines"
            />
            
            <v-file-input
              label="Select File (PDF, DOC..."
              v-model="file"
              variant="outlined"
              color="primary"
              prepend-icon="mdi-file-document-outline"
              class="mb-6"
              show-size
              accept=".pdf,.doc,.docx,.txt"
              required
            ></v-file-input>

            <v-btn
              type="submit"
              color="primary"
              variant="flat"
              class="w-100"
              size="x-large"
              :loading="uploading"
            >
              <v-icon start>mdi-cloud-upload</v-icon> Upload to Knowledge Base
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

      <!-- Knowledge Base List -->
      <v-col cols="12" md="7">
        <v-card class="pa-6 h-100 d-flex flex-column" elevation="1">
          <h3 class="text-h5 font-weight-bold mb-6 d-flex align-center">
            <v-icon start color="primary" class="mr-2">mdi-database-outline</v-icon>
            Knowledge Base Documents
          </h3>

          <v-divider class="mb-4 opacity-20"></v-divider>

          <v-alert v-if="documents.length === 0" color="info" variant="tonal" icon="mdi-information-outline">
            No documents in the knowledge base yet.
          </v-alert>

          <v-list class="bg-transparent px-0 flex-grow-1" style="overflow-y: auto; max-height: 250px;">
            <v-list-item
              v-for="doc in documents"
              :key="doc.id"
              class="mb-3 rounded-lg border-subtle doc-item"
            >
              <template v-slot:prepend>
                <v-avatar color="secondary" variant="tonal" class="mr-4">
                  <v-icon>mdi-file-document</v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title class="font-weight-bold text-body-1">{{ doc.title || doc.filePath }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption mt-1">Uploaded at {{ new Date(doc.createdAt).toLocaleDateString() }}</v-list-item-subtitle>
              
              <template v-slot:append>
                <v-btn icon variant="text" color="error" @click="deleteDocument(doc.id)">
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- User Management Section -->
    <v-row class="mt-8">
      <v-col cols="12">
        <v-card class="pa-6" elevation="1">
          <div class="d-flex align-center justify-space-between mb-6">
            <h3 class="text-h5 font-weight-bold d-flex align-center">
              <v-icon start color="primary" class="mr-2">mdi-account-group-outline</v-icon>
              User Management
            </h3>
            <v-btn color="primary" variant="flat" prepend-icon="mdi-account-plus" @click="createUserDialog = true">
              Create User
            </v-btn>
          </div>
          <v-divider class="mb-4 opacity-20"></v-divider>

          <v-table class="bg-transparent">
            <thead>
              <tr>
                <th class="text-left font-weight-bold">ID</th>
                <th class="text-left font-weight-bold">Name</th>
                <th class="text-left font-weight-bold">Email</th>
                <th class="text-left font-weight-bold">Role</th>
                <th class="text-center font-weight-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="doc-item">
                <td>{{ user.id }}</td>
                <td class="font-weight-bold">{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <v-chip size="small" :color="user.role === 'admin' ? 'warning' : 'primary'">{{ user.role.replace('_', ' ') }}</v-chip>
                </td>
                <td class="text-center d-flex align-center justify-center">
                  <v-select
                    v-model="user._selectedRole"
                    :items="roleOptions"
                    variant="underlined"
                    hide-details
                    density="compact"
                    class="mr-4 mt-n2"
                    style="max-width: 150px"
                  ></v-select>
                  <v-btn size="small" color="primary" @click="updateUserRole(user)" text>Update</v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

  <!-- Create User Dialog -->
  <v-dialog v-model="createUserDialog" max-width="500">
    <v-card class="pa-4">
      <v-card-title class="text-h5 font-weight-bold mb-4">Create New User</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="createNewUser">
          <v-text-field
            v-model="newUser.name"
            label="Full Name"
            variant="outlined"
            color="primary"
            class="mb-3"
            required
          ></v-text-field>
          <v-text-field
            v-model="newUser.email"
            label="Email Address"
            type="email"
            variant="outlined"
            color="primary"
            class="mb-3"
            required
          ></v-text-field>
          <v-text-field
            v-model="newUser.password"
            label="Temporary Password"
            type="password"
            variant="outlined"
            color="primary"
            class="mb-3"
            required
          ></v-text-field>
          <v-select
            v-model="newUser.role"
            :items="roleOptions"
            label="Account Role"
            variant="outlined"
            color="primary"
            required
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end px-6 pb-4">
        <v-btn variant="text" @click="createUserDialog = false" class="mr-2">Cancel</v-btn>
        <v-btn color="primary" variant="flat" :loading="creatingUser" @click="createNewUser" class="px-6">
          Create Account
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { authStore } from '../stores/auth'

const router = useRouter()
const title = ref('')
const file = ref(null)
const documents = ref([])
const uploading = ref(false)

const createUserDialog = ref(false)
const creatingUser = ref(false)
const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'developer'
})

const users = ref([])
const roleOptions = [
  'intern', 'junior_developer', 'developer', 
  'frontend_developer', 'backend_developer', 
  'senior_developer', 'manager', 'admin'
]

const checkAdmin = () => {
  const token = authStore.token
  if (!token) return router.push('/login')

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.role !== 'admin') {
      alert('You do not have permission to access the admin dashboard.')
      router.push('/dashboard')
    }
  } catch (e) {
    router.push('/login')
  }
}

const fetchDocuments = async () => {
  try {
    const res = await api.get('/api/documents')
    documents.value = res.data
  } catch (e) {
    console.error('Failed to fetch documents', e)
  }
}

const fetchUsers = async () => {
  try {
    const res = await api.get('/api/users')
    users.value = res.data.map(u => ({ ...u, _selectedRole: u.role }))
  } catch (e) {
    console.error('Failed to fetch users', e)
  }
}

const updateUserRole = async (user) => {
  try {
    await api.patch(`/api/users/${user.id}/role`, { role: user._selectedRole })
    user.role = user._selectedRole
    alert('Role updated successfully')
  } catch (e) {
    alert('Failed to update role: ' + (e.response?.data?.message || e.message))
  }
}

const createNewUser = async () => {
  if (!newUser.value.name || !newUser.value.email || !newUser.value.password) {
    return alert('Please fill in all required fields.')
  }

  creatingUser.value = true
  try {
    await api.post('/api/users', newUser.value)
    alert('User created successfully.')
    createUserDialog.value = false
    newUser.value = { name: '', email: '', password: '', role: 'developer' }
    fetchUsers()
  } catch (e) {
    console.error(e)
    alert('Failed to create user: ' + (e.response?.data?.message || e.response?.data?.errors?.[0]?.message || e.message))
  } finally {
    creatingUser.value = false
  }
}

const uploadDocument = async () => {
  if (!file.value || file.value.length === 0) {
    return alert('Please select a file')
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('document', file.value[0] || file.value)
    if (title.value) {
      formData.append('title', title.value)
    }

    await api.post('/api/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    title.value = ''
    file.value = null
    fetchDocuments()
  } catch (e) {
    alert('Upload failed: ' + (e.response?.data?.message || e.message))
  } finally {
    uploading.value = false
  }
}

const deleteDocument = async (id) => {
  if (!confirm('Are you sure you want to delete this document?')) return

  try {
    await api.delete(`/api/documents/${id}`)
    fetchDocuments()
  } catch (e) {
    alert('Failed to delete document: ' + (e.response?.data?.message || e.message))
  }
}

onMounted(() => {
  checkAdmin()
  fetchDocuments()
  fetchUsers()
})
</script>

<style scoped>
.max-width-1200 {
  max-width: 1200px;
  margin: 0 auto;
}
.opacity-20 {
  opacity: 0.2;
}
.border-subtle {
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.doc-item {
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.2s ease;
}
.doc-item:hover {
  background: rgba(255, 255, 255, 0.06);
}
</style>
