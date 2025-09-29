<template>
  <v-container v-if="loading">
    <v-row class="fill-height" align-content="center" justify="center">
      <v-col class="text-subtitle-1 text-center" cols="12"> Loading dashboard... </v-col>
      <v-col cols="6">
        <v-progress-linear color="primary" indeterminate rounded height="6"></v-progress-linear>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else>
    <v-row>
      <v-col cols="12">
        <h1>Dashboard</h1>
        <p>Welcome to TaskFlow, {{ user?.firstName }}!</p>
      </v-col>
    </v-row>

    <!-- Admin stats -->
    <v-row v-if="authStore.isAdmin">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Total Projects</v-card-title>
          <v-card-text>
            <p class="text-h4">{{ stats.totalProjects }}</p>
            <v-btn to="/app/projects" color="primary" class="mt-2">View Projects</v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Total Users</v-card-title>
          <v-card-text>
            <p class="text-h4">{{ stats.totalUsers }}</p>
            <v-btn to="/app/users" color="primary" class="mt-2">View Users</v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Total Tasks</v-card-title>
          <v-card-text>
            <p class="text-h4">{{ stats.totalTasks }}</p>
            <v-btn to="/app/tasks" color="primary" class="mt-2">View Tasks</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- User stats for managers and regular users -->
    <v-row v-if="!authStore.isAdmin">
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Projects You're In</v-card-title>
          <v-card-text>
            <p class="text-h4">{{ stats.projectsCount }}</p>
            <v-btn to="/app/projects" color="primary" class="mt-2">View Projects</v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Your Tasks</v-card-title>
          <v-card-text>
            <p class="text-h4">{{ stats.assignedTasksCount }}</p>
            <v-btn to="/app/tasks" color="primary" class="mt-2">View Tasks</v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Completed Tasks</v-card-title>
          <v-card-text>
            <p class="text-h4">{{ stats.completedTasksCount }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Chart section for admin users -->
    <v-row v-if="authStore.isAdmin" class="mt-4">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Users by Role</v-card-title>
          <v-card-text>
            <div v-for="(count, role) in stats.usersByRole || {}" :key="role" class="mb-2">
              <v-progress-linear
                :value="stats.totalUsers ? Math.round((count / stats.totalUsers) * 100) : 0"
                height="25"
                :color="getRoleColor(role)"
              >
                <span class="text-white">{{ role }}: {{ count }}</span>
              </v-progress-linear>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Tasks by Status</v-card-title>
          <v-card-text>
            <div v-for="(count, status) in stats.tasksByStatus || {}" :key="status" class="mb-2">
              <v-progress-linear
                :value="stats.totalTasks ? Math.round((count / stats.totalTasks) * 100) : 0"
                height="25"
                :color="getStatusColor(status)"
              >
                <span class="text-white">{{ status.replace('_', ' ') }}: {{ count }}</span>
              </v-progress-linear>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Chart section for regular users -->
    <v-row v-if="!authStore.isAdmin" class="mt-4">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Project Roles</v-card-title>
          <v-card-text>
            <div v-for="(count, role) in stats.projectsByRole || {}" :key="role" class="mb-2">
              <v-progress-linear
                :value="stats.projectsCount ? Math.round((count / stats.projectsCount) * 100) : 0"
                height="25"
                :color="getRoleColor(role)"
              >
                <span class="text-white">{{ role }}: {{ count }}</span>
              </v-progress-linear>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Tasks by Status</v-card-title>
          <v-card-text>
            <div class="mb-2">
              <v-progress-linear
                :value="
                  stats.assignedTasksCount && stats.completedTasksCount
                    ? Math.round((stats.completedTasksCount / stats.assignedTasksCount) * 100)
                    : 0
                "
                height="25"
                color="success"
              >
                <span class="text-white">Completed: {{ stats.completedTasksCount || 0 }}</span>
              </v-progress-linear>
            </div>
            <div class="mb-2">
              <v-progress-linear
                :value="
                  stats.assignedTasksCount && stats.inProgressTasksCount
                    ? Math.round((stats.inProgressTasksCount / stats.assignedTasksCount) * 100)
                    : 0
                "
                height="25"
                color="warning"
              >
                <span class="text-white">In Progress: {{ stats.inProgressTasksCount || 0 }}</span>
              </v-progress-linear>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>Recent Activity</v-card-title>
          <v-card-text>
            <p>No recent activity to show.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import dashboardService from '@/services/dashboardService'

const authStore = useAuthStore()
const user = authStore.user
const loading = ref(true)

// Define types locally since they're not exported as types from the service
interface AdminDashboardStats {
  totalProjects: number
  totalUsers: number
  totalTasks: number
  activeProjects: number
  completedTasks: number
  usersByRole: Record<string, number>
  tasksByStatus: Record<string, number>
  projectsByStatus: Record<string, number>
}

interface UserDashboardStats {
  projectsCount: number
  assignedTasksCount: number
  completedTasksCount: number
  inProgressTasksCount: number
  overdueTasksCount: number
  projectsByRole: Record<string, number>
}

// Using a combined type to handle both admin and user stats
interface CombinedDashboardStats extends AdminDashboardStats, UserDashboardStats {}
const stats = ref<Partial<CombinedDashboardStats>>({
  totalProjects: 0,
  totalUsers: 0,
  totalTasks: 0,
  activeProjects: 0,
  completedTasks: 0,
  usersByRole: {},
  tasksByStatus: {},
  projectsByStatus: {},
  projectsCount: 0,
  assignedTasksCount: 0,
  completedTasksCount: 0,
  inProgressTasksCount: 0,
  overdueTasksCount: 0,
  projectsByRole: {},
})

onMounted(async () => {
  try {
    if (authStore.isAdmin) {
      const adminStats = (await dashboardService.getAdminDashboardStats()) as CombinedDashboardStats
      stats.value = { ...stats.value, ...adminStats }
    } else {
      const userStats = (await dashboardService.getUserDashboardStats()) as CombinedDashboardStats
      stats.value = { ...stats.value, ...userStats }
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  } finally {
    loading.value = false
  }
})

const getRoleColor = (role: string) => {
  switch (role.toUpperCase()) {
    case 'ADMIN':
      return 'error'
    case 'USER':
      return 'success'
    case 'MANAGER':
      return 'primary'
    case 'WORKER':
      return 'secondary'
    default:
      return 'grey'
  }
}

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'TODO':
      return 'info'
    case 'IN_PROGRESS':
      return 'warning'
    case 'REVIEW':
      return 'primary'
    case 'DONE':
      return 'success'
    default:
      return 'grey'
  }
}
</script>
