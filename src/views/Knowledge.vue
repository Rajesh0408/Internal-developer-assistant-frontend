<template>
  <v-container class="mt-8 max-width-1200">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card class="pa-8 text-center text-md-left glass-card" elevation="2">
          <v-row align="center">
            <v-col cols="12" md="8">
              <h1 class="text-h3 font-weight-bold mb-2">Knowledge Base</h1>
              <p class="text-subtitle-1 text-medium-emphasis">
                Explore architectural documents, organization charts, and official internal guidelines securely.
              </p>
            </v-col>
            <v-col cols="12" md="4" class="text-md-right text-center mt-4 mt-md-0">
               <v-icon color="primary" size="80" class="opacity-80">mdi-library</v-icon>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Document Search Local -->
    <v-card class="glass-card pa-4 mb-8" elevation="0">
      <v-text-field
        v-model="search"
        placeholder="Filter organizational documents by title or filename..."
        prepend-inner-icon="mdi-file-search"
        variant="solo-filled"
        density="comfortable"
        hide-details
        class="bg-surface rounded-lg"
      ></v-text-field>
    </v-card>

    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-10">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row v-else-if="filteredDocuments.length === 0">
      <v-col cols="12" class="text-center py-10">
        <v-icon size="64" color="disabled" class="mb-4">mdi-file-document-outline</v-icon>
        <h3 class="text-h6 text-medium-emphasis">No documents matched your filter.</h3>
      </v-col>
    </v-row>

    <v-row auto-height v-else>
      <v-col v-for="doc in filteredDocuments" :key="doc.id" cols="12" sm="6" md="4">
        <v-card class="document-card fill-height d-flex flex-column rounded-xl" elevation="2">
          <div class="pa-6 flex-grow-1">
            <v-avatar color="primary-lighten-4" size="56" class="mb-4 text-primary bg-primary-lighten-5">
              <v-icon size="32">mdi-file-document-multiple</v-icon>
            </v-avatar>
            <h3 class="text-h6 font-weight-bold mb-1 doc-title">{{ doc.title }}</h3>
            <p class="text-caption text-medium-emphasis mb-0 d-flex align-center">
              <v-icon size="14" class="mr-1">mdi-calendar</v-icon>
              {{ new Date(doc.createdAt).toLocaleDateString() }}
            </p>
          </div>
          <v-divider></v-divider>
          <div class="pa-4 bg-surface-light d-flex justify-end">
             <v-btn :href="`http://localhost:3333/uploads/${doc.filePath}?view=true`" target="_blank" color="secondary" variant="outlined" size="small" class="px-4 mr-2 rounded-pill text-none font-weight-bold">
               View <v-icon end size="16">mdi-eye</v-icon>
             </v-btn>
             <v-btn :href="`http://localhost:3333/uploads/${doc.filePath}`" target="_blank" color="primary" variant="flat" size="small" class="px-6 rounded-pill text-none font-weight-bold">
               Download <v-icon end size="16">mdi-download</v-icon>
             </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const documents = ref([])
const search = ref('')
const loading = ref(true)

const fetchDocuments = async () => {
  try {
    const res = await api.get('/api/documents')
    documents.value = res.data
  } catch (e) {
    console.error('Failed to load documents', e)
  } finally {
    loading.value = false
  }
}

const filteredDocuments = computed(() => {
  if (!search.value) return documents.value
  const s = search.value.toLowerCase()
  return documents.value.filter(d => 
    d.title.toLowerCase().includes(s) || d.filePath.toLowerCase().includes(s)
  )
})

onMounted(() => {
  fetchDocuments()
})
</script>

<style scoped>
.document-card {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.document-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
}
.doc-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}
.bg-primary-lighten-5 {
  background-color: #f3f8ff !important;
}
</style>
