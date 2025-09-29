<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6">
          <v-card-title class="text-center mb-6">
            <h2>Login to TaskFlow</h2>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
                :error-messages="emailError"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
                :error-messages="passwordError"
              ></v-text-field>

              <v-btn type="submit" color="primary" block :loading="loading" :disabled="loading">
                Login
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center">
            <p>Don't have an account? <router-link to="/register">Register</router-link></p>
          </v-card-actions>

          <div v-if="error" class="error-message mt-4 text-center">
            {{ error }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showValidationErrors = ref(false) // Track if we should show validation errors

const emailError = computed(() => {
  if (showValidationErrors.value && !email.value) return 'Email is required'
  if (showValidationErrors.value && email.value && !/^\S+@\S+\.\S+$/.test(email.value))
    return 'Invalid email format'
  return ''
})

const passwordError = computed(() => {
  if (showValidationErrors.value && !password.value) return 'Password is required'
  if (showValidationErrors.value && password.value && password.value.length < 6)
    return 'Password must be at least 6 characters'
  return ''
})

const isValid = computed(() => {
  return !emailError.value && !passwordError.value && email.value && password.value
})

const handleLogin = async () => {
  showValidationErrors.value = true // Show validation errors after submit attempt
  if (!isValid.value) return

  try {
    await authStore.login(email.value, password.value)
    router.push('/app/dashboard')
  } catch (err: any) {
    error.value = err || 'Login failed'
  }
}
</script>

<style scoped>
.error-message {
  color: red;
}
</style>
