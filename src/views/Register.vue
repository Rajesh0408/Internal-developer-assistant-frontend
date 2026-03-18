<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 80vh;">
    <v-card class="glass-card pa-8" width="100%" max-width="450" elevation="0">
      <div class="text-center mb-8">
        <h2 class="text-h4 font-weight-bold mb-2">Create Account</h2>
        <p class="text-medium-emphasis">Join the developer community</p>
      </div>

      <v-form @submit.prevent="register">
        <v-text-field
          label="Full Name"
          v-model="name"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          color="primary"
          class="mb-4"
          required
        ></v-text-field>

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
          label="Phone Number (Optional)"
          v-model="phoneNumber"
          prepend-inner-icon="mdi-phone-outline"
          variant="outlined"
          color="primary"
          class="mb-4"
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
          class="custom-btn bg-gradient-secondary mb-6"
          block
          size="x-large"
          elevation="4"
          :loading="loading"
        >
          Sign Up
        </v-btn>
      </v-form>

      <div class="text-center text-body-2">
        Already have an account?
        <router-link to="/login" class="text-primary text-decoration-none font-weight-bold">
          Log in instead
        </router-link>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const phoneNumber = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()

const register = async () => {
  if (!name.value || !email.value || !password.value) return

  loading.value = true
  try {
    await api.post('/auth/signup', {
      name: name.value,
      email: email.value,
      phoneNumber: phoneNumber.value,
      password: password.value,
    })

    router.push('/login')
  } catch (err) {
    alert('Registration failed. Please check your details.')
  } finally {
    loading.value = false
  }
}
</script>