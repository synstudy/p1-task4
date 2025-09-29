<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>TaskFlow</v-app-bar-title>

      <template v-slot:append>
        <v-btn to="/login" variant="text" v-if="!isLoggedIn">Login</v-btn>
        <v-btn to="/register" variant="text" v-if="!isLoggedIn">Register</v-btn>
        <v-btn @click="logout" variant="text" v-else>Logout</v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isAuthenticated)

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
