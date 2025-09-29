import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PublicLayout from '@/layouts/PublicLayout.vue'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import ProjectDetailView from '@/views/ProjectDetailView.vue'
import TasksView from '@/views/TasksView.vue'
import TaskDetailView from '@/views/TaskDetailView.vue'
import UsersView from '@/views/UsersView.vue'
import UserProfileView from '@/views/UserProfileView.vue'
import KanbanView from '@/views/KanbanView.vue'

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: LoginView,
      },
      {
        path: 'login',
        name: 'Login',
        component: LoginView,
      },
      {
        path: 'register',
        name: 'Register',
        component: RegisterView,
      },
    ],
  },
  {
    path: '/app',
    component: AuthenticatedLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
      },
      {
        path: 'projects',
        name: 'Projects',
        component: ProjectsView,
      },
      {
        path: 'projects/:id',
        name: 'ProjectDetail',
        component: ProjectDetailView,
        props: true,
      },
      {
        path: 'tasks',
        name: 'Tasks',
        component: TasksView,
      },
      {
        path: 'tasks/:id',
        name: 'TaskDetail',
        component: TaskDetailView,
        props: true,
      },
      {
        path: 'users',
        name: 'Users',
        component: UsersView,
      },
      {
        path: 'users/:id',
        name: 'UserProfile',
        component: UserProfileView,
        props: true,
      },
      {
        path: 'kanban',
        name: 'Kanban',
        component: KanbanView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth if needed
  if (!(authStore as any).initialized) {
    await authStore.initializeAuth()
  }

  // Check if route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
