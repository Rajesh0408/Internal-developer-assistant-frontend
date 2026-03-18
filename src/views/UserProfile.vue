<template>
  <v-container class="mt-8 max-width-800">
    <v-btn variant="text" @click="router.back()" class="mb-4" prepend-icon="mdi-arrow-left">Back</v-btn>
    <v-row v-if="loadingUser">
      <v-col class="text-center pa-12">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-else-if="user">
      <v-col cols="12">
        <v-card class="pa-8" elevation="1">
          <div class="d-flex align-center justify-space-between mb-6">
            <h1 class="text-h4 font-weight-bold">{{ user.name || 'Developer' }}</h1>
            <div class="text-right">
              <v-chip color="secondary" size="large" class="font-weight-bold text-uppercase px-4 mb-2">
                <v-icon start>mdi-shield-account</v-icon>
                {{ (user.role || 'user').replace('_', ' ') }}
              </v-chip>
              <div class="text-caption text-medium-emphasis">Joined {{ new Date(user.createdAt).toLocaleDateString() }}</div>
            </div>
          </div>

          <v-divider class="mb-6 opacity-20"></v-divider>

          <v-row>
            <v-col cols="12" sm="6">
              <p class="text-subtitle-2 text-medium-emphasis">Questions Asked</p>
              <p class="text-h6 font-weight-bold text-primary">{{ user.questionsCount || 0 }}</p>
            </v-col>
            <v-col cols="12" sm="6">
              <p class="text-subtitle-2 text-medium-emphasis">Answers Sent</p>
              <p class="text-h6 font-weight-bold text-success">{{ user.answersCount || 0 }}</p>
            </v-col>
            <v-col cols="12">
              <p class="text-subtitle-2 text-medium-emphasis mb-2">Domains of Expertise</p>
              <v-chip-group v-if="user.domains && user.domains.length">
                <v-chip v-for="domain in user.domains" :key="domain" color="primary" variant="tonal">
                  {{ domain }}
                </v-chip>
              </v-chip-group>
              <p class="text-body-2 text-medium-emphasis" v-else>No domains listed.</p>
            </v-col>
          </v-row>

          <div class="d-flex justify-space-between align-center mt-8 pt-6 border-top">
            <div class="text-body-1 font-weight-medium">
              <v-icon start color="primary">mdi-account-multiple</v-icon>
              {{ user.followersCount }} Followers · {{ user.followingCount }} Following
            </div>
            <v-btn
              :color="user.isFollowing ? 'error' : 'primary'"
              variant="flat"
              class="px-8"
              :loading="actionLoading"
              @click="toggleFollow"
              v-if="currentUserId !== user.id"
            >
              <v-icon start>{{ user.isFollowing ? 'mdi-account-minus' : 'mdi-account-plus' }}</v-icon>
              {{ user.isFollowing ? 'Unfollow' : 'Follow' }}
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Tabbed Content: Questions & Answers -->
      <v-col cols="12" class="mt-4">
        <v-card elevation="1">
          <v-tabs v-model="activeTab" color="primary">
            <v-tab value="questions">
              <v-icon start>mdi-comment-question-outline</v-icon> Questions
            </v-tab>
            <v-tab value="answers">
              <v-icon start>mdi-comment-check-outline</v-icon> Answers
            </v-tab>
          </v-tabs>

          <v-divider class="opacity-20"></v-divider>

          <v-window v-model="activeTab" class="pa-4 bg-transparent border-none">
            <!-- Questions Tab -->
            <v-window-item value="questions">
              <v-alert v-if="!user.questions || user.questions.length === 0" color="info" variant="tonal" class="mt-2">
                No questions asked yet.
              </v-alert>
              <div v-else>
                <QuestionCard v-for="q in user.questions" :key="q.id" :question="q" />
              </div>
            </v-window-item>

            <!-- Answers Tab -->
            <v-window-item value="answers">
              <v-alert v-if="!user.answers || user.answers.length === 0" color="info" variant="tonal" class="mt-2">
                No questions answered yet.
              </v-alert>
              <v-list v-else bg-color="transparent" class="px-0">
                <v-list-item
                  v-for="ans in user.answers"
                  :key="ans.id"
                  class="mb-4 rounded-lg border-subtle answer-item pa-4"
                >
                  <div class="text-caption text-primary font-weight-bold mb-1">
                    Answered a question: <router-link :to="`/questions/${ans.questionId}`" class="text-medium-emphasis text-decoration-none">{{ ans.question?.title || 'Question Link' }}</router-link>
                  </div>
                  <div class="text-body-1 mt-2">{{ ans.answerText }}</div>
                  
                  <template v-slot:append>
                    <div class="text-right ml-4">
                      <v-chip size="small" :color="ans.score >= 0 ? 'success' : 'error'" variant="tonal">
                        Score: {{ ans.score }}
                      </v-chip>
                      <div class="text-caption text-medium-emphasis mt-2">{{ new Date(ans.createdAt).toLocaleDateString() }}</div>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'
import QuestionCard from '../components/QuestionCard.vue'

const route = useRoute()
const router = useRouter()
const user = ref(null)
const loadingUser = ref(true)
const actionLoading = ref(false)
const activeTab = ref('questions')

const currentUserId = ref(null)

const fetchProfile = async () => {
  loadingUser.value = true
  try {
    const res = await api.get(`/api/users/${route.params.id}/profile`)
    user.value = res.data
  } catch (e) {
    console.error(e)
    alert('User not found or error loading profile')
    router.back()
  } finally {
    loadingUser.value = false
  }
}

const toggleFollow = async () => {
  actionLoading.value = true
  try {
    if (user.value.isFollowing) {
      await api.delete(`/api/users/${user.value.id}/unfollow`)
      user.value.isFollowing = false
      user.value.followersCount -= 1
    } else {
      await api.post(`/api/users/${user.value.id}/follow`)
      user.value.isFollowing = true
      user.value.followersCount += 1
    }
  } catch (e) {
    alert('Failed to update follow status')
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      currentUserId.value = payload.id
    } catch(e) {}
  }
  fetchProfile()
})
</script>

<style scoped>
.max-width-800 {
  max-width: 800px;
  margin: 0 auto;
}
.opacity-20 {
  opacity: 0.2;
}
.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
.border-subtle {
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.answer-item {
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.2s ease;
}
.answer-item:hover {
  background: rgba(255, 255, 255, 0.06);
}
</style>
