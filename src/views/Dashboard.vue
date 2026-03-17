<template>
  <v-container class="mt-8 max-width-1200">

    <!-- Welcome Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card class="glass-card pa-8 d-flex align-center justify-space-between" elevation="0">
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">
              Welcome back, <span class="text-gradient">{{ userName.split('@')[0] }}</span>
            </h1>
            <p class="text-h6 text-medium-emphasis">Here's what's happening in your community today.</p>
          </div>
          <div class="text-right">
            <v-chip color="secondary" size="large" class="font-weight-bold text-uppercase px-4 py-2 custom-btn" elevation="2">
              <v-icon start icon="mdi-shield-account-outline"></v-icon>
              {{ userRole }}
            </v-chip>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-8">
      <!-- Stats: Questions -->
      <v-col cols="12" md="4">
        <v-card class="glass-card pa-6 d-flex flex-column align-center justify-center h-100" elevation="0">
          <v-icon size="64" color="primary" class="mb-4 opacity-80">mdi-comment-question-outline</v-icon>
          <div class="text-h6 text-medium-emphasis mb-1">Total Questions</div>
          <div class="text-h2 font-weight-bold">{{ totalQuestions }}</div>
        </v-card>
      </v-col>

      <!-- Stats: Answers -->
      <v-col cols="12" md="4">
        <v-card class="glass-card pa-6 d-flex flex-column align-center justify-center h-100" elevation="0">
          <v-icon size="64" color="success" class="mb-4 opacity-80">mdi-check-decagram-outline</v-icon>
          <div class="text-h6 text-medium-emphasis mb-1">Total Answers</div>
          <div class="text-h2 font-weight-bold">{{ totalAnswers }}</div>
        </v-card>
      </v-col>

      <!-- Quick Actions -->
      <v-col cols="12" md="4">
        <v-card class="glass-card pa-6 h-100 d-flex flex-column justify-center" elevation="0">
          <h3 class="text-h5 font-weight-bold mb-6 text-center">Quick Actions</h3>
          <v-btn class="custom-btn bg-gradient-primary mb-4" block size="x-large" @click="goToQuestions">
            <v-icon start>mdi-magnify</v-icon> View & Search Questions
          </v-btn>
          <v-btn class="custom-btn bg-gradient-secondary" block size="x-large" @click="goToQuestions('ask')">
            <v-icon start>mdi-plus-circle-outline</v-icon> Ask a New Question
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Notifications -->
    <v-row>
      <v-col cols="12">
        <v-card class="glass-card pa-6" elevation="0">
          <v-card-title class="text-h5 font-weight-bold px-0 mb-4 d-flex align-center">
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
            You're all caught up! No recent notifications.
          </v-alert>

          <v-list v-else bg-color="transparent" class="px-0">
            <v-list-item
              v-for="note in notifications"
              :key="note.id"
              class="mb-3 rounded-lg py-3 notification-item"
              :class="note.isRead ? '' : 'bg-surface-light'"
            >
              <template v-slot:prepend>
                <v-avatar color="primary" variant="tonal" class="mr-4">
                  <v-icon>mdi-message-text-outline</v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title class="font-weight-medium text-body-1">
                {{ note.message }}
              </v-list-item-title>
              
              <template v-slot:append v-if="!note.isRead">
                <v-badge dot color="error" inline></v-badge>
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

const userName = ref('')
const userRole = ref('')
const totalQuestions = ref(0)
const totalAnswers = ref(0)
const notifications = ref([])

const decodeToken = () => {
  const token = authStore.token
  if (!token) return

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    userName.value = payload.email || 'Developer'
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