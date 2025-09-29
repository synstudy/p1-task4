import api from '@/services/api'
import type { User } from '@/types/user'

const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get('/users')
    return response.data
  },

  async getById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  async update(id: string, userData: Partial<User>): Promise<User> {
    // This is now the admin endpoint for updating any user
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  async updateSelf(userData: Partial<User>): Promise<User> {
    // This is the endpoint for users to update their own profile
    const response = await api.put('/users/me', userData)
    return response.data
  },

  async updateRole(id: string, role: 'USER' | 'ADMIN'): Promise<User> {
    const response = await api.patch(`/users/${id}/role`, { role })
    return response.data
  },
}

export default userService
