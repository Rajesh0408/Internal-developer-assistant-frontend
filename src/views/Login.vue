<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 80vh;">
    <v-card class="glass-card pa-8" width="100%" max-width="450" elevation="0">
      <div class="text-center mb-8">
        <h2 class="text-h4 font-weight-bold mb-2">Welcome Back</h2>
        <p class="text-medium-emphasis">Log in to your developer workspace</p>
      </div>

      <v-form @submit.prevent="login">
        <v-text-field
          label="Email address"
          v-model="email"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          color="primary"
          class="mb-4"
          required
        ></v-text-field>

        <v-text-field
          label="Password"
          type="password"
          v-model="password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          color="primary"
          class="mb-6"
          required
        ></v-text-field>

        <v-btn
          type="submit"
          class="custom-btn bg-gradient-primary mb-6"
          block
          size="x-large"
          elevation="4"
          :loading="loading"
        >
          Sign In
        </v-btn>
      </v-form>

      <div class="text-center text-body-2">
        Don't have an account?
        <router-link to="/register" class="text-primary text-decoration-none font-weight-bold">
          Create one now
        </router-link>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import { authStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

const login = async () => {
  if (!email.value || !password.value) return
  
  loading.value = true
  try {
    const res = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    })

    authStore.setToken(res.data.token)
    router.push('/dashboard')
  } catch (err) {
    alert('Invalid credentials')
  } finally {
    loading.value = false
  }
}
</script>