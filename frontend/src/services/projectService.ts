import api from '@/services/api'
import type { Project } from '@/types/project'

const projectService = {
  async getAll(): Promise<Project[]> {
    const response = await api.get('/projects')
    return response.data
  },

  async getById(id: string): Promise<Project> {
    const response = await api.get(`/projects/${id}`)
    return response.data
  },

  async getByMemberId(memberId: string): Promise<Project[]> {
    const response = await api.get(`/projects/member/${memberId}`)
    return response.data
  },

  async create(
    projectData: Omit<Project, 'id' | 'ownerId' | 'ownerName' | 'createdAt' | 'updatedAt'>,
  ): Promise<Project> {
    const response = await api.post('/projects', projectData)
    return response.data
  },

  async update(id: string, projectData: Partial<Project>): Promise<Project> {
    const response = await api.put(`/projects/${id}`, projectData)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/projects/${id}`)
  },

  async addMember(projectId: string, userId: string): Promise<void> {
    await api.post(`/projects/${projectId}/members`, { userId })
  },

  async removeMember(projectId: string, userId: string): Promise<void> {
    await api.delete(`/projects/${projectId}/members/${userId}`)
  },

  async getMembers(projectId: string): Promise<any[]> {
    const response = await api.get(`/projects/${projectId}/members`)
    return response.data
  },
}

export default projectService
