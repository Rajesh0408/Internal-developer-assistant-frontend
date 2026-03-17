<template>
  <v-container class="mt-8 max-width-800">
    <v-row>
      <v-col cols="12">
        <v-card class="pa-8" elevation="1">
          <div class="d-flex align-center justify-space-between mb-6">
            <h1 class="text-h4 font-weight-bold">My Profile</h1>
            <div class="text-right">
              <v-chip color="secondary" size="large" class="font-weight-bold text-uppercase px-4 mb-2">
                <v-icon start>mdi-shield-account</v-icon>
                {{ userRole.replace('_', ' ') }}
              </v-chip>
              <div class="text-caption text-medium-emphasis">Joined {{ joinedDate }}</div>
            </div>
          </div>

          <v-divider class="mb-6 opacity-20"></v-divider>

          <v-row>
            <v-col cols="12" sm="4">
              <p class="text-subtitle-2 text-medium-emphasis">Display Name</p>
              <p class="text-body-1 font-weight-medium">{{ userName }}</p>
            </v-col>
            <v-col cols="12" sm="4">
              <p class="text-subtitle-2 text-medium-emphasis">Email</p>
              <p class="text-body-1 font-weight-medium">{{ userEmail }}</p>
            </v-col>
            <v-col cols="12" sm="4">
              <p class="text-subtitle-2 text-medium-emphasis">Phone Number</p>
              <p class="text-body-1 font-weight-medium">{{ phoneNumber || 'Not provided' }}</p>
            </v-col>
            <v-col cols="12" sm="6">
              <p class="text-subtitle-2 text-medium-emphasis">Questions Asked</p>
              <p class="text-h6 font-weight-bold text-primary">{{ questionsCount }}</p>
            </v-col>
            <v-col cols="12" sm="6">
              <p class="text-subtitle-2 text-medium-emphasis">Answers Sent</p>
              <p class="text-h6 font-weight-bold text-success">{{ answersCount }}</p>
            </v-col>
            <v-col cols="12">
              <p class="text-subtitle-2 text-medium-emphasis mb-2">Domains of Expertise</p>
              <v-chip-group v-if="domains.length">
                <v-chip v-for="domain in domains" :key="domain" color="primary" variant="tonal">
                  {{ domain }}
                </v-chip>
              </v-chip-group>
              <p class="text-body-2 text-medium-emphasis" v-else>No domains added yet.</p>
            </v-col>
          </v-row>

          <div class="d-flex justify-space-between align-center mt-8 pt-6 border-top">
            <div class="text-body-1 font-weight-medium">
              <v-icon start color="primary">mdi-account-multiple</v-icon>
              {{ followersCount }} Followers
            </div>
            <v-btn
              color="primary"
              variant="flat"
              class="px-8"
              @click="dialog = true"
            >
              <v-icon start>mdi-pencil</v-icon> Edit Profile
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tabbed Content: Questions & Answers -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="1">
          <v-tabs v-model="activeTab" color="primary">
            <v-tab value="questions">
              <v-icon start>mdi-comment-question-outline</v-icon> My Questions
            </v-tab>
            <v-tab value="answers">
              <v-icon start>mdi-comment-check-outline</v-icon> My Answers
            </v-tab>
          </v-tabs>

          <v-divider class="opacity-20"></v-divider>

          <v-window v-model="activeTab" class="pa-4 bg-transparent border-none">
            
            <!-- Questions Tab -->
            <v-window-item value="questions">
              <v-alert v-if="!questions || questions.length === 0" color="info" variant="tonal" class="mt-2">
                You haven't asked any questions yet.
              </v-alert>
              <div v-else>
                <QuestionCard v-for="q in questions" :key="q.id" :question="q" />
              </div>
            </v-window-item>

            <!-- Answers Tab -->
            <v-window-item value="answers">
              <v-alert v-if="!answers || answers.length === 0" color="info" variant="tonal" class="mt-2">
                You haven't answered any questions yet.
              </v-alert>
              <v-list v-else bg-color="transparent" class="px-0">
                <v-list-item
                  v-for="ans in answers"
                  :key="ans.id"
                  class="mb-4 rounded-lg border-subtle answer-item pa-4"
                >
                  <div class="text-caption text-primary font-weight-bold mb-1">
                    Answered a question: <span class="text-medium-emphasis">{{ ans.question?.title || 'Unknown Question' }}</span>
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

    <!-- Edit Profile Dialog -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card class="pa-4">
        <v-card-title class="text-h5 font-weight-bold mb-4">Edit Profile</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveProfile">
            <v-text-field
              v-model="editName"
              variant="outlined"
              color="primary"
              label="Display Name"
              prepend-inner-icon="mdi-account-outline"
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="editPhone"
              variant="outlined"
              color="primary"
              label="Phone Number"
              prepend-inner-icon="mdi-phone-outline"
              class="mb-4"
            ></v-text-field>

            <p class="text-subtitle-1 text-medium-emphasis mb-2">Domains of Expertise</p>
            <p class="text-caption text-medium-emphasis mb-3">Press enter to add technologies (e.g. Java, Python).</p>
            
            <v-combobox
              v-model="editDomains"
              multiple
              chips
              closable-chips
              variant="outlined"
              color="primary"
              label="Domains"
              prepend-inner-icon="mdi-brain"
            ></v-combobox>
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end px-6 pb-4">
          <v-btn variant="text" @click="dialog = false" class="mr-2">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="saveProfile"
            :loading="loading"
            class="px-6"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { authStore } from '../stores/auth'
import QuestionCard from '../components/QuestionCard.vue'

const userName = ref('')
const userRole = ref('')
const userEmail = ref('')
const joinedDate = ref('')
const phoneNumber = ref('')
const questionsCount = ref(0)
const answersCount = ref(0)
const domains = ref([])
const followersCount = ref(0)
const loading = ref(false)

const activeTab = ref('questions')
const questions = ref([])
const answers = ref([])

const dialog = ref(false)
const editName = ref('')
const editPhone = ref('')
const editDomains = ref([])

const fetchProfile = async () => {
  try {
    const res = await api.get('/api/users/me')
    const user = res.data
    userName.value = user.name || user.email || 'Developer'
    userEmail.value = user.email
    phoneNumber.value = user.phoneNumber || ''
    userRole.value = user.role || 'user'
    questionsCount.value = user.questionsCount || 0
    answersCount.value = user.answersCount || 0
    domains.value = user.domains || []
    questions.value = user.questions || []
    answers.value = user.answers || []
    joinedDate.value = new Date(user.createdAt).toLocaleDateString()

    editName.value = userName.value
    editPhone.value = phoneNumber.value
    editDomains.value = [...domains.value]

    const followers = await api.get('/api/users/me/followers')
    followersCount.value = followers.data.length
  } catch(e) {
    console.error('Error fetching profile', e)
    alert('Failed to load profile data: ' + (e.response?.data?.message || e.message))
  }
}

const saveProfile = async () => {
  loading.value = true
  try {
    const res = await api.put('/api/users/me', {
      name: editName.value,
      phoneNumber: editPhone.value,
      domains: editDomains.value
    })
    
    // Update display values
    userName.value = res.data.name || res.data.email
    phoneNumber.value = res.data.phoneNumber || ''
    domains.value = res.data.domains || []
    
    dialog.value = false
  } catch (e) {
    console.error(e)
    alert('Failed to update profile: ' + (e.response?.data?.message || e.message))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
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
