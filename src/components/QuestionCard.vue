<template>
  <v-card class="glass-card pa-4 question-card mb-4" @click="goToDetail" elevation="0" style="cursor:pointer">
    <v-row no-gutters>
      <!-- Stats Column -->
      <v-col cols="12" sm="2" class="d-flex flex-sm-column justify-sm-start align-sm-end pr-sm-4 mb-2 mb-sm-0 text-sm-right text-caption text-medium-emphasis">
         <div class="mb-sm-2 mr-4 mr-sm-0">
           <span class="font-weight-medium">0</span> votes
         </div>
         <div :class="question.answers?.length > 0 ? 'text-success font-weight-medium border px-1 rounded' : ''" class="mr-4 mr-sm-0">
           <span class="font-weight-medium">{{ question.answers?.length || 0 }}</span> answers
         </div>
      </v-col>

      <!-- Content Column -->
      <v-col cols="12" sm="10">
        <h3 class="text-h6 font-weight-bold mb-1 text-primary" style="line-height: 1.3">
          {{ question.title }}
        </h3>
        
        <div class="text-body-2 opacity-80 mb-2 text-truncate" style="max-width: 100%;">
          {{ question.description }}
        </div>

        <div class="d-flex flex-wrap align-center justify-space-between mt-2">
          <v-chip-group v-if="question.tags?.length" class="pa-0 ma-0">
            <v-chip
              v-for="tag in question.tags"
              :key="tag"
              color="secondary"
              variant="tonal"
              size="x-small"
              class="mr-1 font-weight-medium"
            >
              {{ tag }}
            </v-chip>
          </v-chip-group>
          <div v-else></div>

          <div class="text-caption d-flex align-center mt-2 mt-sm-0">
             <v-avatar size="16" color="primary" class="mr-1">
               <span class="text-white" style="font-size: 10px;">{{ question.user?.name?.charAt(0).toUpperCase() }}</span>
             </v-avatar>
             <router-link :to="`/users/${question.user?.id}`" class="text-primary text-decoration-none mr-1" @click.stop>
               {{ question.user?.name }}
             </router-link> 
             <span class="text-medium-emphasis">asked on {{ new Date(question.createdAt).toLocaleDateString() }}</span>
          </div>
        </div>
      </v-col>
    </v-row>
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