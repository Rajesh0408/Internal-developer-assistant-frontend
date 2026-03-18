<template>
  <v-container class="mt-8 max-width-1000 animate-fade-in" v-if="question">
    
    <v-btn variant="text" class="mb-6 px-0" to="/questions" color="medium-emphasis">
      <v-icon start>mdi-arrow-left</v-icon> Back to Questions
    </v-btn>

    <!-- Question Section -->
    <v-card class="glass-card mb-8 pa-6" elevation="0">
      <div class="d-flex flex-column flex-md-row justify-space-between align-start mb-6">
        <h1 class="text-h4 font-weight-bold flex-grow-1" style="line-height: 1.3;">
          {{ question.title }}
        </h1>
      </div>

      <div class="d-flex align-center mb-6 py-3 border-y border-opacity-10">
        <v-avatar size="40" color="primary" variant="tonal" class="mr-3">
          <span class="font-weight-bold">{{ question.user?.name?.charAt(0).toUpperCase() }}</span>
        </v-avatar>
        <div>
          <router-link :to="`/users/${question.user?.id}`" class="text-subtitle-1 font-weight-bold text-primary text-decoration-none">{{ question.user?.name }}</router-link>
          <div class="text-caption text-medium-emphasis">Asked a question</div>
        </div>
      </div>

      <v-card-text class="pa-0 mb-6 text-body-1 opacity-90" style="line-height: 1.7; white-space: pre-wrap;">
        {{ question.description }}
      </v-card-text>

      <v-chip-group v-if="question.tags?.length" class="mt-4 px-0 pb-0">
        <v-chip
          v-for="tag in question.tags"
          :key="tag"
          color="secondary"
          variant="outlined"
          class="mr-2 font-weight-medium"
        >
          <v-icon start icon="mdi-tag-outline" size="16"></v-icon>
          {{ tag }}
        </v-chip>
      </v-chip-group>
    </v-card>

    <div class="d-flex align-center mb-6">
      <h2 class="text-h5 font-weight-bold">
        {{ question.answers?.length || 0 }} Answer{{ question.answers?.length !== 1 ? 's' : '' }}
      </h2>
      <v-spacer></v-spacer>
    </div>

    <!-- Answers Section -->
    <div v-if="question.answers?.length === 0" class="mb-8">
      <v-card class="glass-card pa-8 text-center" elevation="0">
        <v-icon size="48" color="medium-emphasis" class="mb-3 opacity-50">mdi-comment-off-outline</v-icon>
        <div class="text-h6 text-medium-emphasis">No answers yet. Be the first to share your knowledge!</div>
      </v-card>
    </div>

    <div class="mb-8">
      <AnswerCard
        v-for="(answer, index) in sortedAnswers"
        :key="answer.id"
        :answer="answer"
        @refresh="fetchQuestion"
        class="animate-fade-in"
        :style="`animation-delay: ${index * 0.1}s`"
      />
    </div>

    <!-- Add Answer -->
    <v-card class="glass-card pa-6 mb-12" id="answer-form" elevation="0">
      <h3 class="text-h5 font-weight-bold mb-6">Your Answer</h3>

      <v-textarea
        v-model="answerText"
        label="Write your answer..."
        variant="outlined"
        color="primary"
        rows="6"
        placeholder="Provide a detailed and helpful response..."
        bg-color="rgba(0,0,0,0.1)"
      />

      <div class="d-flex justify-end mt-4">
        <v-btn
          class="custom-btn bg-gradient-primary px-8"
          size="large"
          elevation="2"
          @click="submitAnswer"
          :loading="loading"
        >
          Post Your Answer
        </v-btn>
      </div>
    </v-card>

  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import AnswerCard from '../components/AnswerCard.vue'

const route = useRoute()
const question = ref(null)
const answerText = ref('')
const loading = ref(false)

const sortedAnswers = computed(() => {
  if (!question.value?.answers) return []
  // Sort answers by score (descending)
  return [...question.value.answers].sort((a, b) => b.score - a.score)
})

const fetchQuestion = async () => {
  try {
    const res = await api.get(`/api/questions/${route.params.id}`)
    question.value = res.data
  } catch (e) {
    console.error('Error fetching question details', e)
  }
}

const submitAnswer = async () => {
  if (!answerText.value.trim()) return
  
  loading.value = true
  try {
    await api.post('/api/answers', {
      answerText: answerText.value,
      questionId: Number(route.params.id),
    })

    answerText.value = ''
    fetchQuestion()
  } catch (err) {
    alert('Failed to post answer')
  } finally {
    loading.value = false
  }
}

onMounted(fetchQuestion)
</script>

<style scoped>
.max-width-1000 {
  max-width: 1000px;
  margin: 0 auto;
}
.opacity-90 {
  opacity: 0.9;
}
.opacity-50 {
  opacity: 0.5;
}
.border-y {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>