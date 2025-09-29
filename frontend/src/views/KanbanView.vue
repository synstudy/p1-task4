<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Kanban Board</h1>
        <p>Manage your tasks with drag-and-drop kanban board</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-select
          v-model="selectedProjectId"
          :items="projects"
          item-title="name"
          item-value="id"
          label="Select Project"
          @update:modelValue="onProjectChange"
          :loading="loading"
        ></v-select>
      </v-col>
    </v-row>

    <v-row v-if="selectedProjectId">
      <v-col cols="12">
        <KanbanBoard :tasks="tasks" :project-id="selectedProjectId" @update:tasks="updateTasks" />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card>
          <v-card-title>Please select a project</v-card-title>
          <v-card-text>
            <p>Select a project from the dropdown above to view its Kanban board.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import KanbanBoard from '@/components/KanbanBoard.vue'
import projectService from '@/services/projectService'
import taskService from '@/services/taskService'
import type { Project } from '@/types/project'
import type { Task } from '@/types/task'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const projects = ref<Project[]>([])
const tasks = ref<Task[]>([])
const selectedProjectId = ref<string | null>(null)
const loading = ref(true)

onMounted(async () => {
  await loadProjects()
  loading.value = false
})

const loadProjects = async () => {
  try {
    // Get projects where user is a member
    if (authStore.isAdmin || authStore.isManager) {
      // Admins and managers can see all projects
      projects.value = await projectService.getAll()
    } else if (authStore.user) {
      // Regular users see projects they're members of
      projects.value = await projectService.getByMemberId(authStore.user.id)
    }
  } catch (error) {
    console.error('Error loading projects:', error)
  }
}

const loadTasks = async (projectId: string) => {
  if (!projectId) return

  try {
    tasks.value = await taskService.getByProjectId(projectId)
  } catch (error) {
    console.error('Error loading tasks:', error)
  }
}

const onProjectChange = async (projectId: string) => {
  selectedProjectId.value = projectId
  if (projectId) {
    await loadTasks(projectId)
  }
}

const updateTasks = (updatedTasks: Task[]) => {
  tasks.value = updatedTasks
}
</script>
