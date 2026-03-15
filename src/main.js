import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const customDarkTheme = {
  dark: true,
  colors: {
    background: '#0f172a',
    surface: '#1e293b',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    error: '#ef4444',
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
  },
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customDarkTheme',
    themes: {
      customDarkTheme,
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
