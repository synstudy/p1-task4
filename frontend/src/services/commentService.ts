import api from '@/services/api'
import type { Comment } from '@/types/comment'

const commentService = {
  async getAll(): Promise<Comment[]> {
    const response = await api.get('/comments')
    return response.data
  },

  async getById(id: string): Promise<Comment> {
    const response = await api.get(`/comments/${id}`)
    return response.data
  },

  async getByTaskId(taskId: string): Promise<Comment[]> {
    const response = await api.get(`/comments/task/${taskId}`)
    return response.data
  },

  async getByAuthorId(authorId: string): Promise<Comment[]> {
    const response = await api.get(`/comments/author/${authorId}`)
    return response.data
  },

  async create(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    const response = await api.post('/comments', commentData)
    return response.data
  },

  async update(id: string, commentData: Partial<Comment>): Promise<Comment> {
    const response = await api.put(`/comments/${id}`, commentData)
    return response.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/comments/${id}`)
  },
}

export default commentService
