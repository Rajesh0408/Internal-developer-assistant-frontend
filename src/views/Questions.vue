<template>
  <v-container class="mt-8 max-width-1000">

    <div class="d-flex align-center justify-space-between mb-8">
      <div>
        <h1 class="text-h3 font-weight-bold mb-2">Explore <span class="text-gradient">Questions</span></h1>
        <p class="text-h6 text-medium-emphasis">Find answers, or ask your own.</p>
      </div>
      <v-btn class="custom-btn bg-gradient-secondary px-6" size="x-large" elevation="4" @click="dialog = true">
        <v-icon start>mdi-plus</v-icon> Ask Question
      </v-btn>
    </div>

    <!-- Search Bar -->
    <v-card class="glass-card pa-4 mb-8" elevation="0">
      <v-row align="center" no-gutters>
        <v-col cols="12" md="9" class="pr-md-4 mb-4 mb-md-0">
          <v-text-field
            v-model="searchKeyword"
            label="Search questions by title, keyword, or tags..."
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            bg-color="rgba(0,0,0,0.2)"
            hide-details
            @keyup.enter="searchQuestions"
            clearable
            rounded="lg"
          />
        </v-col>
        <v-col cols="12" md="3" class="d-flex">
          <v-btn class="custom-btn bg-gradient-primary flex-grow-1" style="height: 56px;" size="large" elevation="2" @click="searchQuestions">
            Search
          </v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Question List -->
    <v-row>
      <v-col
        v-for="(question, index) in questions"
        :key="question.id"
        cols="12"
      >
        <div :style="`animation-delay: ${index * 0.05}s`" class="animate-fade-in">
          <QuestionCard :question="question" />
        </div>
      </v-col>
      
      <v-col cols="12" v-if="questions.length === 0">
        <v-card class="glass-card pa-10 text-center" elevation="0">
          <v-icon size="64" color="medium-emphasis" class="mb-4 opacity-50">mdi-magnify-close</v-icon>
          <h3 class="text-h5 font-weight-bold mb-2">No questions found</h3>
          <p class="text-medium-emphasis">Try adjusting your search or ask a new question.</p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create Question Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent transition="dialog-bottom-transition">
      <v-card class="glass-card" style="border: 2px solid rgba(255,255,255,0.1)">
        <v-card-title class="text-h5 font-weight-bold pa-6 pb-2">
          Ask a New Question
        </v-card-title>

        <v-card-text class="px-6 pb-6 mt-4">
          <v-text-field 
            label="Title" 
            v-model="title" 
            variant="outlined" 
            color="primary"
            placeholder="e.g. How to implement JWT authentication?"
            class="mb-4"
          />
          <v-textarea 
            label="Description" 
            v-model="description" 
            variant="outlined"
            color="primary"
            class="mb-4"
            rows="5"
            placeholder="Include all the information someone would need to answer your question."
          />
          <v-text-field
            label="Tags"
            v-model="tagsInput"
            variant="outlined"
            color="primary"
            placeholder="e.g. adonis, vue, authentication (comma separated)"
            hint="Tags help people find your question"
            persistent-hint
          />
        </v-card-text>

        <v-divider class="opacity-20"></v-divider>

        <v-card-actions class="pa-4 pa-sm-6">
          <v-spacer />
          <v-btn variant="text" class="custom-btn px-4" @click="dialog = false">Cancel</v-btn>
          <v-btn class="custom-btn bg-gradient-primary px-6 ml-4" elevation="2" @click="createQuestion" :loading="loading">
            Post Question
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import QuestionCard from '../components/QuestionCard.vue'

const questions = ref([])
const dialog = ref(false)
const loading = ref(false)
const route = useRoute()

const title = ref('')
const description = ref('')
const tagsInput = ref('')

const searchKeyword = ref('')

// Fetch all questions
const fetchQuestions = async () => {
  try {
    const res = await api.get('/api/questions')
    questions.value = res.data
  } catch (e) {
    console.error('Error fetching questions', e)
  }
}

// Search questions
const searchQuestions = async () => {
  if (!searchKeyword.value) {
    fetchQuestions()
    return
  }

  try {
    const res = await api.get(
      `/api/questions/search?keyword=${searchKeyword.value}`
    )
    questions.value = res.data
  } catch {
    alert('Search failed')
  }
}

// Create question
const createQuestion = async () => {
  if (!title.value || !description.value) return
  
  loading.value = true
  try {
    await api.post('/api/questions', {
      title: title.value,
      description: description.value,
      tags: tagsInput.value
        ? tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        : [],
    })

    dialog.value = false
    title.value = ''
    description.value = ''
    tagsInput.value = ''

    fetchQuestions()
  } catch {
    alert('Error creating question')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchQuestions()
  if (route.query.action === 'ask') {
    dialog.value = true
  }
})
</script>

<style scoped>
.max-width-1000 {
  max-width: 1000px;
  margin: 0 auto;
}
.opacity-50 {
  opacity: 0.5;
}
.opacity-20 {
  opacity: 0.2;
}
</style>