<template>
  <v-container v-if="loading">
    <v-row class="fill-height" align-content="center" justify="center">
      <v-col class="text-subtitle-1 text-center" cols="12"> Loading user profile... </v-col>
      <v-col cols="6">
        <v-progress-linear color="primary" indeterminate rounded height="6"></v-progress-linear>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else-if="user" fluid>
    <v-row>
      <v-col cols="12">
        <v-toolbar flat color="transparent">
          <v-toolbar-title>User Profile</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="canEditUser"
            color="primary"
            @click="showEditDialog = true"
            prepend-icon="mdi-pencil"
          >
            Edit
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="text-center">
            <v-avatar color="primary" size="128" class="mb-4">
              <span class="text-h4 white--text">{{ getInitials }}</span>
            </v-avatar>
            <h2>{{ user.firstName }} {{ user.lastName }}</h2>
            <p class="text--secondary">{{ user.email }}</p>
            <v-chip :color="getRoleColor(user.role)" label class="mt-2">
              {{ user.role }}
            </v-chip>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Member Since</v-list-item-title>
                <v-list-item-subtitle>{{
                  user.createdAt ? formatDate(user.createdAt) : 'Unknown'
                }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Last Updated</v-list-item-title>
                <v-list-item-subtitle>{{
                  user.updatedAt ? formatDate(user.updatedAt) : 'Unknown'
                }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-tabs v-model="tab" bg-color="primary">
          <v-tab value="projects">Projects</v-tab>
          <v-tab value="tasks">Tasks</v-tab>
        </v-tabs>

        <v-window v-model="tab" class="mt-4">
          <!-- Projects Tab -->
          <v-window-item value="projects">
            <v-card>
              <v-card-title>Projects</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="projectHeaders"
                  :items="projects"
                  :loading="loadingProjects"
                  class="elevation-1"
                >
                  <template v-slot:item.status="{ item }">
                    <v-chip :color="getProjectStatusColor(item.status)" label size="small">
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <template v-slot:item.role="{ item }">
                    <v-chip :color="getProjectRoleColor(item.role || '')" label size="small">
                      {{ item.role || 'Member' }}
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn icon variant="text" @click="viewProject(item)">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- Tasks Tab -->
          <v-window-item value="tasks">
            <v-card>
              <v-card-title>Tasks</v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="taskHeaders"
                  :items="tasks"
                  :loading="loadingTasks"
                  class="elevation-1"
                >
                  <template v-slot:item.projectName="{ item }">
                    <v-chip small outlined>
                      {{ item.projectName }}
                    </v-chip>
                  </template>
                  <template v-slot:item.status="{ item }">
                    <v-chip :color="getTaskStatusColor(item.status)" label size="small">
                      {{ item.status }}
                    </v-chip>
                  </template>
                  <template v-slot:item.priority="{ item }">
                    <v-chip :color="getPriorityColor(item.priority)" label size="small">
                      {{ item.priority }}
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn icon variant="text" @click="viewTask(item)">
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>

    <!-- Edit User Dialog -->
    <v-dialog v-model="showEditDialog" max-width="600px">
      <v-card>
        <v-card-title>Edit User</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="updateUser">
            <v-text-field
              v-model="editUserData.firstName"
              label="First Name"
              required
              :error-messages="firstNameError"
            ></v-text-field>
            <v-text-field
              v-model="editUserData.lastName"
              label="Last Name"
              required
              :error-messages="lastNameError"
            ></v-text-field>
            <v-text-field
              v-model="editUserData.email"
              label="Email"
              required
              :error-messages="emailError"
            ></v-text-field>
            <v-select
              v-if="isAdmin"
              v-model="editUserData.role"
              :items="userRoles"
              label="Role"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showEditDialog = false">Cancel</v-btn>
          <v-btn
            type="submit"
            color="primary"
            @click="updateUser"
            :loading="updatingUser"
            :disabled="updatingUser"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <v-container v-else>
    <v-alert type="error" prominent>
      <v-alert-title>User not found</v-alert-title>
      <div>Unable to load user profile.</div>
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import userService from '@/services/userService'
import projectService from '@/services/projectService'
import taskService from '@/services/taskService'
import type { User } from '@/types/user'
import type { Project } from '@/types/project'
import type { Task } from '@/types/task'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const user = ref<User | null>(null)
const projects = ref<Array<Project & { role?: string }>>([])
const tasks = ref<Task[]>([])
const tab = ref('projects')
const loading = ref(true)
const loadingProjects = ref(false)
const loadingTasks = ref(false)
const showEditDialog = ref(false)
const updatingUser = ref(false)

// Form data
const editUserData = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: 'USER',
})

const showValidationErrors = ref(false)

const firstNameError = computed(() => {
  if (showValidationErrors.value && !editUserData.value.firstName) return 'First name is required'
  return ''
})

const lastNameError = computed(() => {
  if (showValidationErrors.value && !editUserData.value.lastName) return 'Last name is required'
  return ''
})

const emailError = computed(() => {
  if (showValidationErrors.value && !editUserData.value.email) return 'Email is required'
  if (
    showValidationErrors.value &&
    editUserData.value.email &&
    !/.+@.+\..+/.test(editUserData.value.email)
  )
    return 'Email must be valid'
  return ''
})

const isFormValid = computed(() => {
  return (
    !firstNameError.value &&
    !lastNameError.value &&
    !emailError.value &&
    editUserData.value.firstName &&
    editUserData.value.lastName &&
    editUserData.value.email
  )
})

// Constants
const userRoles = [
  { title: 'User', value: 'USER' },
  { title: 'Admin', value: 'ADMIN' },
]

// Headers for data tables
const projectHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Status', key: 'status' },
  { title: 'Role', key: 'role' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const taskHeaders = [
  { title: 'Title', key: 'title' },
  { title: 'Project', key: 'projectName' },
  { title: 'Status', key: 'status' },
  { title: 'Priority', key: 'priority' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Computed properties
const isAdmin = computed(() => authStore.isAdmin)
const canEditUser = computed(() => isAdmin.value || authStore.user?.id === user.value?.id)

const getInitials = computed(() => {
  if (!user.value) return ''
  return `${user.value.firstName.charAt(0)}${user.value.lastName.charAt(0)}`.toUpperCase()
})

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'error'
    case 'USER':
      return 'success'
    default:
      return 'grey'
  }
}

const getProjectStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'warning'
    case 'archived':
      return 'error'
    default:
      return 'info'
  }
}

const getProjectRoleColor = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'manager':
      return 'primary'
    case 'worker':
      return 'secondary'
    default:
      return 'grey'
  }
}

const getTaskStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'todo':
      return 'info'
    case 'in_progress':
      return 'warning'
    case 'review':
      return 'primary'
    case 'done':
      return 'success'
    default:
      return 'grey'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'low':
      return 'success'
    case 'medium':
      return 'info'
    case 'high':
      return 'warning'
    case 'urgent':
      return 'error'
    default:
      return 'grey'
  }
}

// Load user data
const loadUser = async () => {
  try {
    loading.value = true
    const userId = route.params.id as string
    user.value = await userService.getById(userId)
    editUserData.value.firstName = user.value.firstName
    editUserData.value.lastName = user.value.lastName
    editUserData.value.email = user.value.email
    editUserData.value.role = user.value.role as 'USER' | 'ADMIN'
  } catch (err) {
    console.error('Error loading user:', err)
  } finally {
    loading.value = false
  }
}

// Load user projects
const loadUserProjects = async () => {
  try {
    loadingProjects.value = true
    const userId = route.params.id as string

    // If current user is viewing their own profile, get all their projects
    if (authStore.user?.id === userId) {
      projects.value = await projectService.getAll()
    } else {
      // Otherwise, get projects this user is a member of
      projects.value = await projectService.getByMemberId(userId)
    }
  } catch (err) {
    console.error('Error loading projects:', err)
  } finally {
    loadingProjects.value = false
  }
}

// Load user tasks
const loadUserTasks = async () => {
  try {
    loadingTasks.value = true
    const userId = route.params.id as string
    tasks.value = await taskService.getByAssigneeId(userId)
  } catch (err) {
    console.error('Error loading tasks:', err)
  } finally {
    loadingTasks.value = false
  }
}

// Update user
const updateUser = async () => {
  if (!user.value) return

  showValidationErrors.value = true // Show validation errors after submit attempt
  if (!isFormValid.value) return

  try {
    updatingUser.value = true

    // Check if user is editing their own profile
    const isSelf = authStore.user?.id === user.value.id

    let updatedUser
    if (isSelf) {
      // User is editing their own profile, use self-update endpoint
      updatedUser = await userService.updateSelf({
        firstName: editUserData.value.firstName,
        lastName: editUserData.value.lastName,
        email: editUserData.value.email,
        // Note: Regular users cannot change their own role
      })
    } else {
      // Admin is editing another user's profile, use admin endpoint
      updatedUser = await userService.update(user.value.id, {
        firstName: editUserData.value.firstName,
        lastName: editUserData.value.lastName,
        email: editUserData.value.email,
        role: isAdmin.value ? (editUserData.value.role as 'USER' | 'ADMIN') : undefined, // Only admins can change roles
      })
    }

    user.value = updatedUser
    showEditDialog.value = false
    showValidationErrors.value = false

    // Show success message
  } catch (err) {
    console.error('Error updating user:', err)
    // Show error message
  } finally {
    updatingUser.value = false
  }
}

// View project
const viewProject = (project: Project) => {
  router.push(`/app/projects/${project.id}`)
}

// View task
const viewTask = (task: Task) => {
  router.push(`/app/tasks/${task.id}`)
}

// Watch for route changes
watch(
  () => route.params.id,
  () => {
    loadUser()
    loadUserProjects()
    loadUserTasks()
  },
)

// Initialize component
onMounted(() => {
  loadUser()
  loadUserProjects()
  loadUserTasks()
})
</script>
