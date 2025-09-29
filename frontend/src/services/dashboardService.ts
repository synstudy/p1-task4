import api from './api'

export interface AdminDashboardStats {
  totalProjects: number
  totalUsers: number
  totalTasks: number
  activeProjects: number
  completedTasks: number
  usersByRole: Record<string, number>
  tasksByStatus: Record<string, number>
  projectsByStatus: Record<string, number>
}

export interface UserDashboardStats {
  projectsCount: number
  assignedTasksCount: number
  completedTasksCount: number
  inProgressTasksCount: number
  overdueTasksCount: number
  projectsByRole: Record<string, number>
}

const getAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const response = await api.get('/dashboard/admin')
  return response.data
}

const getUserDashboardStats = async (): Promise<UserDashboardStats> => {
  const response = await api.get('/dashboard/user')
  return response.data
}

export default {
  getAdminDashboardStats,
  getUserDashboardStats,
}
