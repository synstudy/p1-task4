import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role)

  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isManager = computed(() => false)
  const isUser = computed(() => user.value?.role === 'USER')

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/users/login', { email, password })
      const { access_token, user: userData } = response.data

      token.value = access_token
      user.value = userData

      // Store token in localStorage
      localStorage.setItem('token', token.value ?? '')
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Login failed'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: Omit<User, 'id' | 'role'> & { password: string }) => {
    loading.value = true
    error.value = null

    try {
      // Only register users with USER role
      const userDataWithRole = {
        ...userData,
        role: 'USER', // Force role to USER for registration
      }

      const response = await api.post('/users/register', userDataWithRole)
      const { access_token, user: createdUser } = response.data

      token.value = access_token
      user.value = createdUser

      // Store token in localStorage
      localStorage.setItem('token', token.value ?? '')
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Registration failed'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  const initializeAuth = async () => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      try {
        // Verify token and fetch user data
        const response = await api.get('/users/me')
        user.value = response.data
      } catch (err: any) {
        if (err.response?.status === 401) {
          // If token is invalid, remove it
          localStorage.removeItem('token')
          token.value = null
          user.value = null
        }
      }
    }
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRole,
    isAdmin,
    isManager,
    isUser,
    login,
    register,
    logout,
    initializeAuth,
  }
})
