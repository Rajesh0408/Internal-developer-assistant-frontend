<template>
  <v-card class="glass-card mb-4 pa-5" elevation="0">
    <v-row>
      <!-- Vote Section -->
      <v-col cols="auto" class="d-flex flex-column align-center justify-start pr-0">
        <v-btn icon variant="text" color="success" @click="vote('up')" size="small" class="mb-1 rounded-circle vote-btn">
          <v-icon size="28">mdi-chevron-up</v-icon>
        </v-btn>

        <div class="text-h6 font-weight-bold my-1" :class="scoreColor">
          {{ answer.score }}
        </div>

        <v-btn icon variant="text" color="error" @click="vote('down')" size="small" class="mt-1 rounded-circle vote-btn">
          <v-icon size="28">mdi-chevron-down</v-icon>
        </v-btn>
      </v-col>

      <!-- Answer Content -->
      <v-col class="pl-6 d-flex flex-column">
        <div class="text-body-1 opacity-90 flex-grow-1" style="line-height: 1.6;">
          {{ answer.answerText }}
        </div>
        
        <div class="d-flex justify-end mt-4">
          <v-card class="pa-3 rounded-lg user-badge bg-surface-light" flat elevation="0" max-width="250">
            <div class="text-caption text-medium-emphasis mb-1">Answered by</div>
            <div class="d-flex align-center">
              <v-avatar size="32" color="primary" variant="tonal" class="mr-3">
                <span class="font-weight-bold">{{ answer.user?.name?.charAt(0).toUpperCase() }}</span>
              </v-avatar>
              <div>
                <router-link :to="`/users/${answer.user?.id}`" class="text-body-2 font-weight-bold text-primary text-decoration-none">{{ answer.user?.name }}</router-link>
                <div class="text-caption text-primary">{{ answer.user?.role || 'Member' }}</div>
              </div>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import api from '../services/api'

const props = defineProps({
  answer: Object,
})

const emit = defineEmits(['refresh'])

const scoreColor = computed(() => {
  if (props.answer.score > 0) return 'text-success'
  if (props.answer.score < 0) return 'text-error'
  return 'text-medium-emphasis'
})

const vote = async (type) => {
  try {
    await api.post('/api/votes', {
      answerId: props.answer.id,
      voteType: type,
    })

    emit('refresh')
  } catch (err) {
    alert('You already voted or something went wrong')
  }
}
</script>

<style scoped>
.vote-btn {
  background: rgba(255, 255, 255, 0.05);
}
.vote-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.opacity-90 {
  opacity: 0.9;
}
.user-badge {
  background: rgba(15, 23, 42, 0.4) !important;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>