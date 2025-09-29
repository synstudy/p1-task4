<template>
  <v-container v-if="loading">
    <v-row class="fill-height" align-content="center" justify="center">
      <v-col class="text-subtitle-1 text-center" cols="12"> Loading task... </v-col>
      <v-col cols="6">
        <v-progress-linear color="primary" indeterminate rounded height="6"></v-progress-linear>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else-if="task" fluid>
    <v-row>
      <v-col cols="12">
        <v-toolbar flat color="transparent">
          <v-toolbar-title>{{ task.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="canEditTask"
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
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>Description</v-card-title>
          <v-card-text>
            <p v-if="task.description">{{ task.description }}</p>
            <p v-else class="text--secondary">No description provided.</p>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>Task Information</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Status</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip :color="getStatusColor(task.status)" label size="small">
                    {{ task.status.replace('_', ' ') }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Priority</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip :color="getPriorityColor(task.priority)" label size="small">
                    {{ task.priority }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Project</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    v-if="task.projectId"
                    color="primary"
                    label
                    size="small"
                    @click="viewProject(task.projectId)"
                    style="cursor: pointer"
                  >
                    {{ task.projectName || 'Project' }}
                  </v-chip>
                  <span v-else>Not assigned to a project</span>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Assignee</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    v-if="task.assigneeId"
                    color="secondary"
                    label
                    size="small"
                    @click="viewUser(task.assigneeId)"
                    style="cursor: pointer"
                  >
                    {{ task.assigneeName || 'Unknown User' }}
                  </v-chip>
                  <span v-else>Unassigned</span>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Creator</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    color="info"
                    label
                    size="small"
                    @click="viewUser(task.creatorId)"
                    style="cursor: pointer"
                  >
                    {{ task.creatorName || 'Unknown User' }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Created</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(task.createdAt) }}</v-list-item-subtitle>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Last Updated</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(task.updatedAt) }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Comments</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="comment in comments" :key="comment.id">
                <v-list-item-title>{{ comment.authorName }}</v-list-item-title>
                <v-list-item-subtitle>{{ comment.content }}</v-list-item-subtitle>
                <v-list-item-subtitle class="text-caption">
                  {{ formatDate(comment.createdAt) }}
                </v-list-item-subtitle>
              </v-list-item>
              <v-list-item v-if="comments.length === 0">
                <v-list-item-subtitle>No comments yet.</v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-textarea
              v-model="newComment.content"
              label="Add a comment"
              rows="3"
              class="mt-4"
            ></v-textarea>
            <v-btn
              color="primary"
              @click="addComment"
              :loading="addingComment"
              :disabled="!newComment.content.trim()"
            >
              Add Comment
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit Task Dialog -->
    <v-dialog v-model="showEditDialog" max-width="600px">
      <v-card>
        <v-card-title>Edit Task</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="updateTask">
            <v-text-field
              v-model="editTaskData.title"
              label="Task Title"
              required
              :error-messages="taskTitleError"
            ></v-text-field>
            <v-textarea v-model="editTaskData.description" label="Description"></v-textarea>
            <v-select v-model="editTaskData.status" :items="taskStatuses" label="Status"></v-select>
            <v-select
              v-model="editTaskData.priority"
              :items="priorities"
              label="Priority"
            ></v-select>
            <v-autocomplete
              v-model="editTaskData.assigneeId"
              :items="availableUsers"
              :item-title="(user) => `${user.firstName} ${user.lastName}`"
              item-value="id"
              label="Assignee"
              clearable
            ></v-autocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showEditDialog = false">Cancel</v-btn>
          <v-btn
            type="submit"
            color="primary"
            @click="updateTask"
            :loading="updatingTask"
            :disabled="updatingTask"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <v-container v-else>
    <v-alert type="error" prominent>
      <v-alert-title>Task not found</v-alert-title>
      <div>Unable to load task details.</div>
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import taskService from '@/services/taskService'
import commentService from '@/services/commentService'
import userService from '@/services/userService'
import type { Task } from '@/types/task'
import type { Comment } from '@/types/comment'
import type { User } from '@/types/user'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const task = ref<Task | null>(null)
const comments = ref<Comment[]>([])
const availableUsers = ref<User[]>([])
const loading = ref(true)
const loadingComments = ref(false)
const loadingUsers = ref(false)
const showEditDialog = ref(false)
const updatingTask = ref(false)
const addingComment = ref(false)

// Form data
const editTaskData = ref({
  title: '',
  description: '',
  status: 'TODO' as Task['status'],
  priority: 'MEDIUM' as Task['priority'],
  assigneeId: null as string | null,
})

const showValidationErrors = ref(false)

const taskTitleError = computed(() => {
  if (showValidationErrors.value && !editTaskData.value.title) return 'Task title is required'
  return ''
})

const isFormValid = computed(() => {
  return !taskTitleError.value && editTaskData.value.title
})

const newComment = ref({
  content: '',
})

// Constants
const taskStatuses = [
  { title: 'To Do', value: 'TODO' },
  { title: 'In Progress', value: 'IN_PROGRESS' },
  { title: 'Review', value: 'REVIEW' },
  { title: 'Done', value: 'DONE' },
]

const priorities = [
  { title: 'Low', value: 'LOW' },
  { title: 'Medium', value: 'MEDIUM' },
  { title: 'High', value: 'HIGH' },
  { title: 'Urgent', value: 'URGENT' },
]

// Computed properties
const isAdmin = computed(() => authStore.isAdmin)
const isManager = computed(() => authStore.isManager)

const canEditTask = computed(() => {
  if (!task.value || !authStore.user) return false
  // Admins can edit any task
  if (isAdmin.value) return true
  // Managers can edit any task
  if (isManager.value) return true
  // Users can edit tasks they created or are assigned to
  return authStore.user.id === task.value.creatorId || authStore.user.id === task.value.assigneeId
})

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusColor = (status: string) => {
  switch (status) {
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'LOW':
      return 'success'
    case 'MEDIUM':
      return 'info'
    case 'HIGH':
      return 'warning'
    case 'URGENT':
      return 'error'
    default:
      return 'grey'
  }
}

// Load task data
const loadTask = async () => {
  try {
    loading.value = true
    const taskId = route.params.id as string
    task.value = await taskService.getById(taskId)
    editTaskData.value.title = task.value.title
    editTaskData.value.description = task.value.description || ''
    editTaskData.value.status = task.value.status
    editTaskData.value.priority = task.value.priority
    editTaskData.value.assigneeId = task.value.assigneeId || null
  } catch (err) {
    console.error('Error loading task:', err)
  } finally {
    loading.value = false
  }
}

// Load task comments
const loadComments = async () => {
  try {
    loadingComments.value = true
    const taskId = route.params.id as string
    comments.value = await commentService.getByTaskId(taskId)
  } catch (err) {
    console.error('Error loading comments:', err)
  } finally {
    loadingComments.value = false
  }
}

// Load available users for assignment
const loadAvailableUsers = async () => {
  try {
    loadingUsers.value = true
    availableUsers.value = await userService.getAll()
  } catch (err) {
    console.error('Error loading users:', err)
  } finally {
    loadingUsers.value = false
  }
}

// Update task
const updateTask = async () => {
  if (!task.value) return

  showValidationErrors.value = true // Show validation errors after submit attempt
  if (!isFormValid.value) return

  try {
    updatingTask.value = true
    const updatedTask = await taskService.update(task.value.id, {
      title: editTaskData.value.title,
      description: editTaskData.value.description,
      status: editTaskData.value.status,
      priority: editTaskData.value.priority,
      assigneeId: editTaskData.value.assigneeId || undefined,
    })

    task.value = updatedTask
    showEditDialog.value = false
    showValidationErrors.value = false

    // Show success message
  } catch (err) {
    console.error('Error updating task:', err)
    // Show error message
  } finally {
    updatingTask.value = false
  }
}

// Add comment
const addComment = async () => {
  if (!task.value || !newComment.value.content.trim()) return

  try {
    addingComment.value = true
    const comment = await commentService.create({
      content: newComment.value.content,
      taskId: task.value.id,
      authorId: authStore.user?.id || '',
    })

    comments.value.push(comment)
    newComment.value.content = ''

    // Show success message
  } catch (err) {
    console.error('Error adding comment:', err)
    // Show error message
  } finally {
    addingComment.value = false
  }
}

// View project
const viewProject = (projectId: string) => {
  router.push(`/app/projects/${projectId}`)
}

// View user
const viewUser = (userId: string) => {
  router.push(`/app/users/${userId}`)
}

// Watch for route changes
watch(
  () => route.params.id,
  () => {
    loadTask()
    loadComments()
  },
)

// Watch for query parameters to auto-open edit dialog
watch(
  () => route.query.edit,
  (newVal) => {
    if (newVal === 'true' && task.value && canEditTask.value) {
      showEditDialog.value = true
    }
  },
  { immediate: true },
)

// Initialize component
onMounted(() => {
  loadTask()
  loadComments()
  loadAvailableUsers()
})
</script>
