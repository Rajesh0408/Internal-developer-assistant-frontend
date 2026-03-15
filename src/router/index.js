import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Questions from '../views/Questions.vue'
import QuestionDetail from '../views/QuestionDetail.vue'

import Admin from '../views/Admin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/questions', component: Questions },
  { path: '/questions/:id', component: QuestionDetail },
  { path: '/admin', component: Admin },
]
})

export default router
