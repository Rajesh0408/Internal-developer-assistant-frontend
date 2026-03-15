<template>
  <v-app class="app-background">
    <!-- Decorative background elements -->
    <div class="bg-shape shape-1"></div>
    <div class="bg-shape shape-2"></div>
    <div class="bg-shape shape-3"></div>

    <Navbar v-if="isLoggedIn" />
    
    <v-main style="position: relative; z-index: 1;">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" class="animate-fade-in" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import Navbar from './components/Navbar.vue'
import { authStore } from './stores/auth'

const isLoggedIn = computed(() => !!authStore.token)
</script>

<style>
.app-background {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}
.bg-shape {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
  opacity: 0.4;
  pointer-events: none;
}
.shape-1 {
  width: 500px;
  height: 500px;
  background: #3b82f6;
  top: -100px;
  left: -100px;
}
.shape-2 {
  width: 400px;
  height: 400px;
  background: #8b5cf6;
  bottom: -50px;
  right: -50px;
}
.shape-3 {
  width: 300px;
  height: 300px;
  background: #ec4899;
  top: 40%;
  left: 30%;
  opacity: 0.2;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>