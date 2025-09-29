import api from '@/services/api'
import type { Task } from '@/types/task'

const taskService = {
  async getAll(): Promise<Task[]> {
    const response = await api.get('/tasks')
    return response.data
  },

  async getById(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },

  async getByProjectId(projectId: string): Promise<Task[]> {
    const response = await api.get(`/tasks/project/${projectId}`)
    return response.data
  },

  async getByAssigneeId(assigneeId: string): Promise<Task[]> {
    const response = await api.get(`/tasks/assignee/${assigneeId}`)
    return response.data
  },

  async getByCreatorId(creatorId: string): Promise<Task[]> {
    const response = await api.get(`/tasks/creator/${creatorId}`)
    return response.data
  },

  async create(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const response = await api.post('/tasks', taskData)
    return response.data
  },

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, taskData)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`)
  },
}

export default taskService
