import { reactive } from 'vue'

export const authStore = reactive({
  token: localStorage.getItem('token') || null,
  user: null,

  setToken(token) {
    this.token = token
    localStorage.setItem('token', token)
  },

  logout() {
    this.token = null
    localStorage.removeItem('token')
  },
})