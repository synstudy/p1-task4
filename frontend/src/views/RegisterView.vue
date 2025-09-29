<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6">
          <v-card-title class="text-center mb-6">
            <h2>Create Account</h2>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="firstName"
                label="First Name"
                required
                :error-messages="firstNameError"
              ></v-text-field>

              <v-text-field
                v-model="lastName"
                label="Last Name"
                required
                :error-messages="lastNameError"
              ></v-text-field>

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

              <v-text-field
                v-model="confirmPassword"
                label="Confirm Password"
                type="password"
                required
                :error-messages="confirmPasswordError"
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                block
                :loading="loading"
                :disabled="loading || !isValid"
              >
                Register
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center">
            <p>Already have an account? <router-link to="/login">Login</router-link></p>
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

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const showValidationErrors = ref(false) // Track if we should show validation errors

const firstNameError = computed(() => {
  if (showValidationErrors.value && !firstName.value) return 'First name is required'
  return ''
})

const lastNameError = computed(() => {
  if (showValidationErrors.value && !lastName.value) return 'Last name is required'
  return ''
})

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

const confirmPasswordError = computed(() => {
  if (showValidationErrors.value && !confirmPassword.value) return 'Please confirm your password'
  if (
    showValidationErrors.value &&
    confirmPassword.value &&
    password.value !== confirmPassword.value
  )
    return 'Passwords do not match'
  return ''
})

const isValid = computed(() => {
  return (
    !firstNameError.value &&
    !lastNameError.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value &&
    firstName.value &&
    lastName.value &&
    email.value &&
    password.value &&
    confirmPassword.value
  )
})

const handleRegister = async () => {
  showValidationErrors.value = true // Show validation errors after submit attempt
  if (!isValid.value) return

  try {
    loading.value = true
    error.value = ''

    const userData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    }

    // Registration will always create a USER role user, as handled in the auth store
    await authStore.register(userData)
    router.push('/login')
  } catch (err: any) {
    error.value = err || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.error-message {
  color: red;
}
</style>
