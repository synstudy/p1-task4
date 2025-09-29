<template>
  <v-container v-if="loading">
    <v-row class="fill-height" align-content="center" justify="center">
      <v-col class="text-subtitle-1 text-center" cols="12"> Loading project... </v-col>
      <v-col cols="6">
        <v-progress-linear color="primary" indeterminate rounded height="6"></v-progress-linear>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else-if="project" fluid>
    <v-row>
      <v-col cols="12">
        <v-toolbar flat color="transparent">
          <v-toolbar-title>{{ project.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            v-if="canEditProject"
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
      <v-col cols="12">
        <v-tabs v-model="tab" bg-color="primary">
          <v-tab value="overview">Overview</v-tab>
          <v-tab value="members">Members</v-tab>
          <v-tab value="tasks">Tasks</v-tab>
          <v-tab value="kanban">Kanban</v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-window v-model="tab">
          <!-- Overview Tab -->
          <v-window-item value="overview">
            <v-card class="mb-4">
              <v-card-title>Description</v-card-title>
              <v-card-text>
                <p v-if="project.description">{{ project.description }}</p>
                <p v-else class="text--secondary">No description provided.</p>
              </v-card-text>
            </v-card>

            <v-card>
              <v-card-title>Project Information</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Status</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-chip :color="getStatusColor(project.status)" label size="small">
                        {{ project.status }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Owner</v-list-item-title>
                    <v-list-item-subtitle>{{ project.ownerName }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Created</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDate(project.createdAt) }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Last Updated</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDate(project.updatedAt) }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- Members Tab -->
          <v-window-item value="members">
            <v-card>
              <v-card-title>
                Project Members
                <v-spacer></v-spacer>
                <v-btn
                  v-if="isAdmin || isProjectOwner"
                  color="primary"
                  @click="showAddMemberDialog = true"
                  prepend-icon="mdi-account-plus"
                >
                  Add Member
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="memberHeaders"
                  :items="members"
                  :loading="loadingMembers"
                  class="elevation-1"
                >
                  <template v-slot:item.role="{ item }">
                    <v-chip :color="getRoleColor(item.role)" label size="small">
                      {{ item.role }}
                    </v-chip>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      v-if="isAdmin || isProjectOwner"
                      icon
                      variant="text"
                      @click="removeMember(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-window-item>

          <!-- Tasks Tab -->
          <v-window-item value="tasks">
            <v-card>
              <v-card-title>
                Tasks
                <v-spacer></v-spacer>
                <v-btn
                  v-if="isAdmin || isProjectOwner || isProjectManager"
                  color="primary"
                  @click="showCreateTaskDialog = true"
                  prepend-icon="mdi-plus"
                >
                  Create Task
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :headers="taskHeaders"
                  :items="tasks"
                  :loading="loadingTasks"
                  class="elevation-1"
                >
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

          <!-- Kanban Tab -->
          <v-window-item value="kanban">
            <v-card>
              <v-card-title>
                Kanban Board
                <v-spacer></v-spacer>
                <v-btn
                  v-if="isAdmin || isProjectOwner || isProjectManager"
                  color="primary"
                  @click="showCreateTaskDialog = true"
                  prepend-icon="mdi-plus"
                >
                  Create Task
                </v-btn>
              </v-card-title>
              <v-card-text>
                <KanbanBoard
                  :tasks="tasks"
                  :project-id="project?.id || ''"
                  @update:tasks="updateTasks"
                />
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>

    <!-- Edit Project Dialog -->
    <v-dialog v-model="showEditDialog" max-width="600px">
      <v-card>
        <v-card-title>Edit Project</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="updateProject">
            <v-text-field
              v-model="editProjectData.name"
              label="Project Name"
              required
              :error-messages="projectNameError"
            ></v-text-field>
            <v-textarea v-model="editProjectData.description" label="Description"></v-textarea>
            <v-select
              v-model="editProjectData.status"
              :items="projectStatuses"
              label="Status"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showEditDialog = false">Cancel</v-btn>
          <v-btn
            type="submit"
            color="primary"
            @click="updateProject"
            :loading="updatingProject"
            :disabled="updatingProject"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Member Dialog -->
    <v-dialog v-model="showAddMemberDialog" max-width="600px">
      <v-card>
        <v-card-title>Add Member</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="selectedUser"
            :items="availableUsers"
            item-title="name"
            item-value="id"
            label="Select User"
            :loading="loadingUsers"
          ></v-autocomplete>
          <v-select v-model="selectedRole" :items="projectMemberRoles" label="Role"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showAddMemberDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="addMember"
            :loading="addingMember"
            :disabled="!selectedUser || addingMember"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Task Dialog -->
    <v-dialog v-model="showCreateTaskDialog" max-width="600px">
      <v-card>
        <v-card-title>Create Task</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="createTask">
            <v-text-field
              v-model="newTask.title"
              label="Task Title"
              required
              :error-messages="taskTitleError"
            ></v-text-field>
            <v-textarea v-model="newTask.description" label="Description"></v-textarea>
            <v-select v-model="newTask.priority" :items="priorities" label="Priority"></v-select>
            <v-autocomplete
              v-model="newTask.assigneeId"
              :items="members"
              item-title="name"
              item-value="id"
              label="Assignee"
              clearable
            ></v-autocomplete>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showCreateTaskDialog = false">Cancel</v-btn>
          <v-btn
            type="submit"
            color="primary"
            @click="createTask"
            :loading="creatingTask"
            :disabled="!isTaskFormValid || creatingTask"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <v-container v-else>
    <v-alert type="error" prominent>
      <v-alert-title>Project not found</v-alert-title>
      <div>Unable to load project details.</div>
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import projectService from '@/services/projectService'
import taskService from '@/services/taskService'
import userService from '@/services/userService'
import KanbanBoard from '@/components/KanbanBoard.vue'
import type { Project } from '@/types/project'
import type { Task } from '@/types/task'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const project = ref<Project | null>(null)
const members = ref<Array<{ id: string; name: string; role: string }>>([])
const tasks = ref<Task[]>([])
const availableUsers = ref<Array<{ id: string; name: string }>>([])
const tab = ref('overview')
const loading = ref(true)
const loadingMembers = ref(false)
const loadingTasks = ref(false)
const loadingUsers = ref(false)
const showEditDialog = ref(false)
const showAddMemberDialog = ref(false)
const showCreateTaskDialog = ref(false)
const updatingProject = ref(false)
const addingMember = ref(false)
const creatingTask = ref(false)

// Form data
const editProjectData = ref({
  name: '',
  description: '',
  status: 'ACTIVE',
})

const showValidationErrors = ref(false)

const projectNameError = computed(() => {
  if (showValidationErrors.value && !editProjectData.value.name) return 'Project name is required'
  return ''
})

const isFormValid = computed(() => {
  return !projectNameError.value && editProjectData.value.name
})

const selectedUser = ref<string | null>(null)
const selectedRole = ref('WORKER')

const newTask = ref({
  title: '',
  description: '',
  priority: 'MEDIUM',
  assigneeId: null as string | null,
})

const showTaskValidationErrors = ref(false)

const taskTitleError = computed(() => {
  if (showTaskValidationErrors.value && !newTask.value.title) return 'Task title is required'
  return ''
})

const isTaskFormValid = computed(() => {
  return !taskTitleError.value && newTask.value.title
})

// Constants
const projectStatuses = [
  { title: 'Active', value: 'ACTIVE' },
  { title: 'Inactive', value: 'INACTIVE' },
  { title: 'Archived', value: 'ARCHIVED' },
]

const projectMemberRoles = [
  { title: 'Worker', value: 'WORKER' },
  { title: 'Manager', value: 'MANAGER' },
]

const priorities = [
  { title: 'Low', value: 'LOW' },
  { title: 'Medium', value: 'MEDIUM' },
  { title: 'High', value: 'HIGH' },
  { title: 'Urgent', value: 'URGENT' },
]

// Headers for data tables
const memberHeaders = [
  { title: 'Name', key: 'name' },
  { title: 'Role', key: 'role' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const taskHeaders = [
  { title: 'Title', key: 'title' },
  { title: 'Status', key: 'status' },
  { title: 'Priority', key: 'priority' },
  { title: 'Assignee', key: 'assigneeName' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Computed properties
const isAdmin = computed(() => authStore.isAdmin)
const isProjectOwner = computed(() => project.value && authStore.user?.id === project.value.ownerId)
const isProjectManager = computed(() => {
  if (!project.value || !authStore.user) return false
  const member = members.value.find((m) => m.id === authStore.user?.id)
  return member?.role === 'MANAGER'
})

const canEditProject = computed(() => isAdmin.value || isProjectOwner.value)

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusColor = (status: string) => {
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

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
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

// Load project data
const loadProject = async () => {
  try {
    loading.value = true
    const projectId = route.params.id as string
    project.value = await projectService.getById(projectId)
    editProjectData.value.name = project.value.name
    editProjectData.value.description = project.value.description || ''
    editProjectData.value.status = project.value.status
  } catch (err) {
    console.error('Error loading project:', err)
  } finally {
    loading.value = false
  }
}

// Load project members
const loadMembers = async () => {
  try {
    loadingMembers.value = true
    const projectId = route.params.id as string
    const projectMembers = await projectService.getMembers(projectId)

    // Transform members to include names
    members.value = projectMembers.map((member) => ({
      id: member.userId,
      name: `${member.user.firstName} ${member.user.lastName}`,
      role: member.role,
    }))
    console.log(members.value)
  } catch (err) {
    console.error('Error loading members:', err)
  } finally {
    loadingMembers.value = false
  }
}

// Load project tasks
const loadTasks = async () => {
  try {
    loadingTasks.value = true
    const projectId = route.params.id as string
    tasks.value = await taskService.getByProjectId(projectId)
  } catch (err) {
    console.error('Error loading tasks:', err)
  } finally {
    loadingTasks.value = false
  }
}

// Load available users for adding members
const loadAvailableUsers = async () => {
  try {
    loadingUsers.value = true
    const allUsers = await userService.getAll()
    availableUsers.value = allUsers.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
    }))
  } catch (err) {
    console.error('Error loading users:', err)
  } finally {
    loadingUsers.value = false
  }
}

// Update tasks list (for Kanban board updates)
const updateTasks = (updatedTasks: Task[]) => {
  tasks.value = updatedTasks
}

// Create task
const createTask = async () => {
  if (!project.value) return

  showTaskValidationErrors.value = true // Show validation errors after submit attempt
  if (!isTaskFormValid.value) return

  try {
    creatingTask.value = true
    await taskService.create({
      title: newTask.value.title,
      description: newTask.value.description,
      status: 'TODO', // Default status
      priority: newTask.value.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
      projectId: project.value.id,
      creatorId: authStore.user?.id || '',
      creatorName: `${authStore.user?.firstName} ${authStore.user?.lastName}` || 'Unknown User',
      assigneeId: newTask.value.assigneeId || undefined,
    })

    // Reload tasks
    await loadTasks()
    showCreateTaskDialog.value = false
    newTask.value = {
      title: '',
      description: '',
      priority: 'MEDIUM',
      assigneeId: null,
    }
    showTaskValidationErrors.value = false

    // Show success message
  } catch (err) {
    console.error('Error creating task:', err)
    // Show error message
  } finally {
    creatingTask.value = false
  }
}

// Add member to project
const addMember = async () => {
  if (!project.value || !selectedUser.value) return

  try {
    addingMember.value = true
    await projectService.addMember(project.value.id, selectedUser.value)

    // Reload members
    await loadMembers()
    showAddMemberDialog.value = false
    selectedUser.value = null

    // Show success message
  } catch (err) {
    console.error('Error adding member:', err)
    // Show error message
  } finally {
    addingMember.value = false
  }
}

// Remove member from project
const removeMember = async (member: { id: string; name: string; role: string }) => {
  if (!project.value) return

  if (confirm(`Are you sure you want to remove ${member.name} from this project?`)) {
    try {
      await projectService.removeMember(project.value.id, member.id)
      await loadMembers()
      // Show success message
    } catch (err) {
      console.error('Error removing member:', err)
      // Show error message
    }
  }
}

// Update project
const updateProject = async () => {
  if (!project.value) return

  showValidationErrors.value = true // Show validation errors after submit attempt
  if (!isFormValid.value) return

  try {
    updatingProject.value = true
    await projectService.update(project.value.id, {
      name: editProjectData.value.name,
      description: editProjectData.value.description,
      status: editProjectData.value.status as 'ACTIVE' | 'INACTIVE' | 'ARCHIVED',
    })

    // Reload project data
    await loadProject()
    showEditDialog.value = false
    showValidationErrors.value = false

    // Show success message
    // This would normally be handled by a notification system
  } catch (err) {
    console.error('Error updating project:', err)
    // Show error message
  } finally {
    updatingProject.value = false
  }
}

// View task
const viewTask = (task: Task) => {
  router.push(`/app/tasks/${task.id}`)
}

// Watch for route changes
watch(
  () => route.params.id,
  () => {
    loadProject()
    loadMembers()
    loadTasks()
  },
)

// Initialize component
onMounted(() => {
  loadProject()
  loadMembers()
  loadTasks()
  loadAvailableUsers()
})
</script>
