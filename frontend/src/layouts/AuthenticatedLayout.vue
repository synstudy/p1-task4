<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>TaskFlow</v-app-bar-title>

      <template v-slot:append>
        <v-btn @click="logout" variant="text">Logout</v-btn>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list nav>
        <v-list-item to="/app/dashboard" value="home" title="Dashboard" link></v-list-item>
        <v-list-item to="/app/projects" value="projects" title="Projects" link></v-list-item>
        <v-list-item to="/app/tasks" value="tasks" title="Tasks" link></v-list-item>
        <v-list-item to="/app/kanban" value="kanban" title="Kanban" link></v-list-item>
        <v-list-item
          v-if="authStore.isAdmin || authStore.isManager"
          to="/app/users"
          value="users"
          title="Users"
          link
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const drawer = ref(true)
const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
