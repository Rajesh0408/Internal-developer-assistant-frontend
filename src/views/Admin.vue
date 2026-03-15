<template>
  <v-container class="mt-8 max-width-1000 animate-fade-in">

    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h1 class="text-h3 font-weight-bold mb-2">Platform <span class="text-gradient">Admin</span></h1>
        <p class="text-h6 text-medium-emphasis">Manage knowledge base and platform health.</p>
      </div>
    </div>

    <v-row>
      <!-- Upload Document Section -->
      <v-col cols="12" md="5">
        <v-card class="glass-card pa-6 h-100" elevation="0">
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
              class="custom-btn bg-gradient-primary w-100"
              size="x-large"
              elevation="2"
              :loading="uploading"
            >
              <v-icon start>mdi-cloud-upload</v-icon> Upload to Knowledge Base
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

      <!-- Knowledge Base List -->
      <v-col cols="12" md="7">
        <v-card class="glass-card pa-6 h-100 d-flex flex-column" elevation="0">
          <h3 class="text-h5 font-weight-bold mb-6 d-flex align-center">
            <v-icon start color="primary" class="mr-2">mdi-database-outline</v-icon>
            Knowledge Base Documents
          </h3>

          <v-divider class="mb-4 opacity-20"></v-divider>

          <v-alert v-if="documents.length === 0" color="info" variant="tonal" icon="mdi-information-outline">
            No documents in the knowledge base yet.
          </v-alert>

          <v-list class="bg-transparent px-0 flex-grow-1" style="overflow-y: auto; max-height: 400px;">
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
    alert('Upload failed. ' + (e.response?.data?.message || ''))
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
    alert('Failed to delete document')
  }
}

onMounted(() => {
  checkAdmin()
  fetchDocuments()
})
</script>

<style scoped>
.max-width-1000 {
  max-width: 1000px;
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
