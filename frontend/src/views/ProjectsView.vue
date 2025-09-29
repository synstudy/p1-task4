<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Projects</h1>
        <p>Manage your projects here.</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn
          v-if="authStore.isAdmin || authStore.isManager"
          color="primary"
          @click="showCreateDialog = true"
          >Create Project</v-btn
        >
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="6" lg="4" v-for="project in projects" :key="project.id">
        <v-card>
          <v-card-title>{{ project.name }}</v-card-title>
          <v-card-subtitle>Owner: {{ project.ownerName }}</v-card-subtitle>
          <v-card-text>
            <p>{{ project.description || 'No description' }}</p>
            <p class="mt-2">
              <v-chip :color="getStatusColor(project.status)" label size="small">
                {{ project.status }}
              </v-chip>
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="viewProject(project.id)">View</v-btn>
            <v-btn
              v-if="authStore.isAdmin || authStore.isManager || isProjectOwner(project)"
              color="warning"
              @click="editProject(project)"
              >Edit</v-btn
            >
            <v-btn
              v-if="authStore.isAdmin || isProjectOwner(project)"
              color="error"
              @click="deleteProject(project.id)"
              >Delete</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create Project Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="600px">
      <v-card>
        <v-card-title>Create New Project</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="createProject">
            <v-text-field
              v-model="newProject.name"
              label="Project Name"
              required
              :error-messages="projectNameError"
            ></v-text-field>
            <v-textarea v-model="newProject.description" label="Description"></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showCreateDialog = false">Cancel</v-btn>
          <v-btn
            type="submit"
            color="primary"
            @click="createProject"
            :loading="loading"
            :disabled="loading"
            >Create</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import projectService from '@/services/projectService'
import type { Project } from '@/types/project'

const router = useRouter()
const authStore = useAuthStore()
const projects = ref<Project[]>([])
const showCreateDialog = ref(false)
const loading = ref(false)
const showValidationErrors = ref(false)
const newProject = ref({
  name: '',
  description: '',
})

const projectNameError = computed(() => {
  if (showValidationErrors.value && !newProject.value.name) return 'Project name is required'
  return ''
})

const isFormValid = computed(() => {
  return !projectNameError.value && newProject.value.name
})

onMounted(async () => {
  await loadProjects()
})

// The backend now handles role-based access control
// ADMIN users get all projects, USER users get only projects they're members of

const loadProjects = async () => {
  try {
    loading.value = true
    projects.value = await projectService.getAll()
  } catch (err) {
    console.error('Error loading projects:', err)
    // Handle error appropriately
  } finally {
    loading.value = false
  }
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

const isProjectOwner = (project: Project) => {
  return authStore.user?.id === project.ownerId
}

const viewProject = (id: string) => {
  router.push(`/app/projects/${id}`)
}

const editProject = (project: Project) => {
  console.log('Edit project:', project)
  // Implement edit functionality
}

const deleteProject = async (id: string) => {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      loading.value = true
      await projectService.delete(id)
      await loadProjects() // Refresh the list
    } catch (err) {
      console.error('Error deleting project:', err)
    } finally {
      loading.value = false
    }
  }
}

const createProject = async () => {
  showValidationErrors.value = true // Show validation errors after submit attempt
  if (!isFormValid.value) return

  try {
    loading.value = true
    await projectService.create({
      name: newProject.value.name,
      description: newProject.value.description,
      status: 'ACTIVE',
      // ownerId will be set automatically by the backend to the current authenticated user
      // ownerName will be set automatically by the backend
      // createdAt and updatedAt will be set automatically by the backend
    })

    showCreateDialog.value = false
    newProject.value = { name: '', description: '' }
    showValidationErrors.value = false
    await loadProjects() // Refresh the list
  } catch (err) {
    console.error('Error creating project:', err)
  } finally {
    loading.value = false
  }
}
</script>
