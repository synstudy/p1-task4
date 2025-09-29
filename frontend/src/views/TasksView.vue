<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Tasks</h1>
        <p>Manage your tasks here.</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn
          v-if="authStore.isAdmin || authStore.isManager"
          color="primary"
          @click="showCreateDialog = true"
          >Create Task</v-btn
        >
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-data-table :headers="headers" :items="tasks" class="elevation-1" :loading="loading">
          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" label size="small">
              {{ item.status }}
            </v-chip>
          </template>

          <template v-slot:item.priority="{ item }">
            <v-chip :color="getPriorityColor(item.priority)" label size="small">
              {{ item.priority }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn size="small" variant="outlined" @click="viewTask(item.id)" class="mr-2">
              View
            </v-btn>
            <v-btn
              size="small"
              variant="outlined"
              color="warning"
              @click="editTask(item)"
              class="mr-2"
              v-if="canEditTask(item)"
            >
              Edit
            </v-btn>
            <v-btn
              size="small"
              variant="outlined"
              color="error"
              @click="deleteTask(item.id)"
              v-if="canDeleteTask(item)"
            >
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Create Task Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="600px">
      <v-card>
        <v-card-title>Create New Task</v-card-title>
        <v-card-text>
          <v-form ref="createTaskForm">
            <v-text-field
              v-model="newTask.title"
              label="Task Title"
              required
              :rules="[(v) => !!v || 'Task title is required']"
            ></v-text-field>
            <v-textarea v-model="newTask.description" label="Description"></v-textarea>
            <v-select
              v-model="newTask.status"
              :items="taskStatuses"
              label="Status"
              :rules="[(v) => !!v || 'Status is required']"
            ></v-select>
            <v-select
              v-model="newTask.priority"
              :items="taskPriorities"
              label="Priority"
              :rules="[(v) => !!v || 'Priority is required']"
            ></v-select>
            <v-select
              v-model="newTask.projectId"
              :items="allProjects"
              item-title="name"
              item-value="id"
              label="Project"
              :rules="[(v) => !!v || 'Project is required']"
            ></v-select>
            <v-select
              v-model="newTask.assigneeId"
              :items="filteredUsers"
              item-title="name"
              item-value="id"
              label="Assignee"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showCreateDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="createTask" :loading="loading" :disabled="loading"
            >Create</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import taskService from '@/services/taskService'
import userService from '@/services/userService'
import projectService from '@/services/projectService'
import type { Task } from '@/types/task'
import type { User } from '@/types/user'
import type { Project } from '@/types/project'

const router = useRouter()
const authStore = useAuthStore()

const headers = [
  { title: 'Title', key: 'title' },
  { title: 'Project', key: 'projectName' },
  { title: 'Status', key: 'status' },
  { title: 'Priority', key: 'priority' },
  { title: 'Assignee', key: 'assigneeName' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const createTaskForm = ref()
const tasks = ref<Task[]>([])
const allUsers = ref<User[]>([])
const allProjects = ref<Project[]>([]) // Add projects for task assignment
const taskStatuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']
const taskPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']
const showCreateDialog = ref(false)
const loading = ref(false)
const newTask = ref({
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  assigneeId: null as string | null,
  projectId: '' as string, // Add project ID field
})

// Filter users based on role
const filteredUsers = computed(() => {
  if (authStore.isAdmin) {
    // Admin can assign to any user
    return allUsers.value.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
    }))
  } else if (authStore.isManager) {
    // Manager can assign to users with role USER
    return allUsers.value
      .filter((user) => user.role === 'USER')
      .map((user) => ({ id: user.id, name: `${user.firstName} ${user.lastName}` }))
  } else if (authStore.isUser) {
    // Regular user can only assign to themselves
    const currentUser = authStore.user
    if (currentUser) {
      return [{ id: currentUser.id, name: `${currentUser.firstName} ${currentUser.lastName}` }]
    }
    return []
  }
  return []
})

onMounted(async () => {
  await loadTasks()
  await loadUsers()
  await loadProjects()
})

const loadProjects = async () => {
  try {
    // Load projects based on user role
    if (authStore.isAdmin || authStore.isManager) {
      // Admins and managers can see all projects
      allProjects.value = await projectService.getAll()
    } else if (authStore.isUser && authStore.user) {
      // Regular users can see projects they're members of
      allProjects.value = await projectService.getByMemberId(authStore.user.id)
    }
  } catch (err) {
    console.error('Error loading projects:', err)
  }
}

const loadTasks = async () => {
  try {
    loading.value = true

    // For USER roles, only show tasks they're assigned to or created
    if (authStore.isUser && authStore.user) {
      // Get tasks assigned to the user
      const assignedTasks = await taskService.getByAssigneeId(authStore.user.id)

      // Get tasks created by the user
      const createdTasks = await taskService.getByCreatorId(authStore.user.id)

      // Combine and deduplicate tasks (some tasks might be both assigned and created by the user)
      const taskMap = new Map<string, Task>()
      ;[...assignedTasks, ...createdTasks].forEach((task) => {
        taskMap.set(task.id, task)
      })

      tasks.value = Array.from(taskMap.values())
    } else {
      // ADMIN and MANAGER roles can see all tasks
      tasks.value = await taskService.getAll()
    }
  } catch (err) {
    console.error('Error loading tasks:', err)
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    allUsers.value = await userService.getAll()
  } catch (err) {
    console.error('Error loading users:', err)
  }
}

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'TODO':
      return 'info'
    case 'IN_PROGRESS':
      return 'warning'
    case 'REVIEW':
      return 'orange'
    case 'DONE':
      return 'success'
    default:
      return 'info'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority.toUpperCase()) {
    case 'LOW':
      return 'success'
    case 'MEDIUM':
      return 'info'
    case 'HIGH':
      return 'warning'
    case 'URGENT':
      return 'error'
    default:
      return 'info'
  }
}

// Check if user can edit a task (task creator, project owner, or admin)
const canEditTask = (task: Task) => {
  if (authStore.isAdmin) return true
  if (authStore.isManager) return true // Manager can edit any task
  return authStore.user?.id === task.creatorId || authStore.user?.id === task.assigneeId
}

// Check if user can delete a task (task creator, or admin)
const canDeleteTask = (task: Task) => {
  if (authStore.isAdmin) return true
  if (authStore.isManager) return true // Manager can delete any task
  return authStore.user?.id === task.creatorId // Only creator can delete
}

const viewTask = (id: string) => {
  router.push(`/app/tasks/${id}`)
}

const editTask = (task: Task) => {
  router.push(`/app/tasks/${task.id}?edit=true`)
}

const deleteTask = async (id: string) => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      loading.value = true
      await taskService.delete(id)
      await loadTasks() // Refresh the list
    } catch (err) {
      console.error('Error deleting task:', err)
    } finally {
      loading.value = false
    }
  }
}

const createTask = async () => {
  // Validate the form before submitting
  const { valid } = await createTaskForm.value.validate()
  if (!valid) return

  try {
    loading.value = true
    await taskService.create({
      title: newTask.value.title,
      description: newTask.value.description,
      status: newTask.value.status as Task['status'],
      priority: newTask.value.priority as Task['priority'],
      assigneeId: newTask.value.assigneeId || undefined,
      projectId: newTask.value.projectId, // Include project ID
      creatorId: authStore.user?.id || '1', // Use current user's ID
      creatorName: `${authStore.user?.firstName} ${authStore.user?.lastName}`, // Use current user's name
    })

    showCreateDialog.value = false
    newTask.value = {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      assigneeId: null,
      projectId: '',
    }
    await loadTasks() // Refresh the list
  } catch (err) {
    console.error('Error creating task:', err)
  } finally {
    loading.value = false
  }
}
</script>
