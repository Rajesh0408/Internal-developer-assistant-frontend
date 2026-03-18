<template>
  <v-app-bar app class="px-4" elevation="1" color="surface">
    <v-toolbar-title class="font-weight-bold text-primary mr-4" style="min-width: 250px;">
      Internal Developer Assistant
    </v-toolbar-title>

    <v-text-field
      v-if="isLoggedIn"
      v-model="searchQuery"
      placeholder="Search questions or users..."
      prepend-inner-icon="mdi-magnify"
      density="compact"
      variant="solo-filled"
      flat
      hide-details
      class="mx-4 bg-surface rounded-xl flex-grow-1"
      style="max-width: 500px;"
      @keyup.enter="performSearch"
    ></v-text-field>

    <v-spacer />

    <!-- If Logged In -->
    <template v-if="isLoggedIn">
      <v-btn variant="text" to="/dashboard" class="custom-btn mx-1" rounded="xl">Dashboard</v-btn>
      <v-btn variant="text" to="/questions" class="custom-btn mx-1" rounded="xl">Questions</v-btn>
      <v-btn variant="text" to="/knowledge" class="custom-btn mx-1" rounded="xl">Knowledge</v-btn>
      <v-btn variant="text" to="/profile" class="custom-btn mx-1" rounded="xl">Profile</v-btn>
      <v-btn v-if="isAdmin" variant="text" to="/admin" class="custom-btn mx-1 text-warning" rounded="xl">
        <v-icon start size="small">mdi-shield-check</v-icon> Admin
      </v-btn>
      <v-btn variant="outlined" @click="logout" color="error" class="custom-btn ml-4" rounded="xl">Logout</v-btn>
    </template>

    <!-- If NOT Logged In -->
    <template v-else>
      <v-btn variant="text" to="/login" class="custom-btn" rounded="xl">Login</v-btn>
      <v-btn variant="flat" color="primary" to="/register" class="custom-btn ml-2" rounded="xl">Register</v-btn>
    </template>

  </v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth'

const router = useRouter()
const searchQuery = ref('')

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/questions?keyword=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

// ✅ Check if logged in
const isLoggedIn = computed(() => !!authStore.token)

const isAdmin = computed(() => {
  if (!authStore.token) return false
  try {
    const payload = JSON.parse(atob(authStore.token.split('.')[1]))
    return payload.role === 'admin'
  } catch (e) {
    return false
  }
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>