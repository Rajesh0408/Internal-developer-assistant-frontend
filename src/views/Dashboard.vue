<template>
  <v-container class="mt-8 max-width-1200">

    <!-- Welcome Section -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card class="pa-8 d-flex align-center justify-space-between" elevation="1">
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">
              Welcome back, <span class="text-primary">{{ userName }}</span>
            </h1>
            <p class="text-h6 text-medium-emphasis">Here's what's happening in your community today.</p>
          </div>
          <div class="text-right d-flex flex-column align-end">
            <v-chip color="secondary" size="large" class="font-weight-bold text-uppercase px-4 py-2 mb-3" elevation="1">
              <v-icon start icon="mdi-shield-account-outline"></v-icon>
              {{ userRole.replace('_', ' ') }}
            </v-chip>
            <v-btn color="secondary" variant="flat" @click="goToQuestions('ask')" size="large">
              <v-icon start>mdi-plus-circle-outline</v-icon> Ask a Question
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Left Column: Feeds -->
      <v-col cols="12" md="8">
        <v-card class="pa-4" elevation="1">
          <v-tabs v-model="activeTab" color="primary" @update:modelValue="handleTabChange">
            <v-tab value="recent">Recent</v-tab>
            <v-tab value="popular">Popular</v-tab>
            <v-tab value="following">Following</v-tab>
            <v-tab value="my_domains">My Domains</v-tab>
          </v-tabs>

          <v-divider class="mb-4 opacity-20" />

          <div v-if="loadingFeed" class="text-center pa-8">
             <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          
          <div v-else>
            <v-alert v-if="feedQuestions.length === 0" color="info" variant="tonal" class="mt-4">
              <v-icon start>mdi-information-outline</v-icon> No questions found for this filter.
            </v-alert>
            <div v-else>
              <QuestionCard v-for="q in feedQuestions" :key="q.id" :question="q" />
            </div>
            
            <div class="d-flex justify-center mt-6" v-if="hasMorePages">
              <v-btn variant="outlined" color="primary" @click="loadMore" :loading="loadingMore">Load More</v-btn>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- Right Column: Sidebar (Notifications & Stats) -->
      <v-col cols="12" md="4">
        
        <!-- Stats -->
        <v-card class="pa-6 mb-4 d-flex align-center justify-space-between" elevation="1">
          <div>
            <div class="text-h6 text-medium-emphasis mb-1">Total Questions</div>
            <div class="text-h4 font-weight-bold text-primary">{{ totalQuestions }}</div>
          </div>
          <v-icon size="48" color="primary" class="opacity-80">mdi-comment-question-outline</v-icon>
        </v-card>

        <v-card class="pa-6 mb-8 d-flex align-center justify-space-between" elevation="1">
          <div>
            <div class="text-h6 text-medium-emphasis mb-1">Total Answers</div>
            <div class="text-h4 font-weight-bold text-success">{{ totalAnswers }}</div>
          </div>
          <v-icon size="48" color="success" class="opacity-80">mdi-check-decagram-outline</v-icon>
        </v-card>

        <!-- Notifications -->
        <v-card class="pa-6" elevation="1">
          <v-card-title class="text-h6 font-weight-bold px-0 mb-4 d-flex align-center">
            <v-icon start color="warning" class="mr-3">mdi-bell-ring-outline</v-icon>
            Recent Notifications
          </v-card-title>
          
          <v-divider class="mb-4 opacity-20" />

          <v-alert
            v-if="notifications.length === 0"
            color="info"
            variant="tonal"
            icon="mdi-information-outline"
            class="mt-4 border-radius-8"
          >
            No recent notifications.
          </v-alert>

          <v-list v-else bg-color="transparent" class="px-0">
            <v-list-item
              v-for="note in notifications"
              :key="note.id"
              class="mb-3 rounded-lg py-3 notification-item"
              :class="note.isRead ? '' : 'bg-surface-light'"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" variant="tonal" class="mr-3" size="36">
                  <v-icon size="small">mdi-message-text-outline</v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title class="font-weight-medium text-body-2" style="white-space: normal;">
                {{ note.message }}
              </v-list-item-title>
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
import QuestionCard from '../components/QuestionCard.vue'

const router = useRouter()

const userName = ref('')
const userRole = ref('')
const totalQuestions = ref(0)
const totalAnswers = ref(0)
const notifications = ref([])

const activeTab = ref('following')
const feedQuestions = ref([])
const loadingFeed = ref(false)
const loadingMore = ref(false)
const currentPage = ref(1)
const hasMorePages = ref(false)

const decodeToken = () => {
  const token = authStore.token
  if (!token) return

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    userName.value = payload.name || payload.email || 'Developer'
    userRole.value = payload.role || 'user'
  } catch (e) {
    console.error('Error decoding token', e)
  }
}

const fetchStats = async () => {
  try {
    const statsRes = await api.get('/api/users/me/stats')
    totalQuestions.value = statsRes.data.totalQuestions
    totalAnswers.value = statsRes.data.totalAnswers
  } catch (e) {
    console.error('Error fetching stats', e)
    alert('Error fetching user stats: ' + (e.response?.data?.message || e.message))
  }
}

const fetchNotifications = async () => {
  try {
    const res = await api.get('/api/notifications')
    notifications.value = res.data.slice(0, 5)
  } catch (e) {
    console.error('Error fetching notifications', e)
  }
}

const handleTabChange = () => {
  feedQuestions.value = []
  fetchFeed(1)
}

const fetchFeed = async (page = 1) => {
  if (page === 1) loadingFeed.value = true
  else loadingMore.value = true

  try {
    const res = await api.get(`/api/questions?filter=${activeTab.value}&page=${page}&limit=10`)
    if (page === 1) {
      feedQuestions.value = res.data.data
    } else {
      feedQuestions.value = [...feedQuestions.value, ...res.data.data]
    }
    hasMorePages.value = res.data.meta.currentPage < res.data.meta.lastPage
    currentPage.value = page
  } catch (e) {
    console.error('Error fetching feed', e)
    alert('Failed to load feed: ' + (e.response?.data?.message || e.message))
  } finally {
    loadingFeed.value = false
    loadingMore.value = false
  }
}

const loadMore = () => {
  fetchFeed(currentPage.value + 1)
}

const goToQuestions = (action = null) => {
  if (action === 'ask') {
    router.push({ path: '/questions', query: { action: 'ask' } })
  } else {
    router.push('/questions')
  }
}

onMounted(() => {
  decodeToken()
  fetchStats()
  fetchNotifications()
  fetchFeed()
})
</script>

<style scoped>
.max-width-1200 {
  max-width: 1200px;
  margin: 0 auto;
}
.opacity-80 {
  opacity: 0.8;
}
.opacity-20 {
  opacity: 0.2;
}
.notification-item {
  background: rgba(255, 255, 255, 0.03);
  transition: background 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.notification-item:hover {
  background: rgba(255, 255, 255, 0.08);
}
.bg-surface-light {
  background: rgba(59, 130, 246, 0.1) !important;
  border-color: rgba(59, 130, 246, 0.3);
}
</style>