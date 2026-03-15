<template>
  <v-card class="glass-card pa-5 question-card mb-4" @click="goToDetail" elevation="0" style="cursor:pointer">
    <div class="d-flex align-start justify-space-between mb-2">
      <v-card-title class="text-h6 font-weight-bold pa-0" style="line-height: 1.3">
        {{ question.title }}
      </v-card-title>
      <v-chip size="small" variant="tonal" color="primary" class="ml-4 font-weight-bold">
        <v-icon start icon="mdi-comment-outline" size="small"></v-icon>
        {{ question.answers?.length || 0 }} Answers
      </v-chip>
    </div>

    <v-card-subtitle class="pa-0 mb-3 d-flex align-center text-medium-emphasis">
      <v-avatar size="24" color="primary" variant="tonal" class="mr-2">
        <span class="text-caption font-weight-bold">{{ question.user?.name?.charAt(0).toUpperCase() }}</span>
      </v-avatar>
      <span class="text-caption">Asked by <strong>{{ question.user?.name }}</strong></span>
    </v-card-subtitle>

    <v-card-text class="pa-0 mb-4 text-body-1 opacity-80" style="line-height: 1.6">
      {{ question.description.length > 150 ? question.description.slice(0, 150) + '...' : question.description }}
    </v-card-text>

    <v-chip-group v-if="question.tags?.length" class="mt-n2 px-0 pb-0">
      <v-chip
        v-for="tag in question.tags"
        :key="tag"
        color="secondary"
        variant="outlined"
        size="small"
        class="mr-2 font-weight-medium"
      >
        <v-icon start icon="mdi-tag-outline" size="14"></v-icon>
        {{ tag }}
      </v-chip>
    </v-chip-group>
  </v-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  question: Object,
})

const router = useRouter()

const goToDetail = () => {
  router.push(`/questions/${props.question.id}`)
}
</script>

<style scoped>
.question-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.question-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3) !important;
  border-color: rgba(59, 130, 246, 0.3);
}
.opacity-80 {
  opacity: 0.8;
}
</style>