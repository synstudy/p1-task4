<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Initialize auth when app mounts
onMounted(() => {
  authStore.initializeAuth()
})
</script>
