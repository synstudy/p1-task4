<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="status in statuses" :key="status.value" cols="12" md="3" class="pa-1">
        <v-card class="kanban-column">
          <v-card-title
            class="pa-3"
            :style="{ backgroundColor: getStatusColor(status.value) + ' !important' }"
          >
            <span class="white--text">{{ status.title }}</span>
            <v-spacer></v-spacer>
            <span class="caption white--text">({{ getTasksByStatus(status.value).length }})</span>
          </v-card-title>
          <v-card-text class="pa-2">
            <draggable
              :list="getTasksByStatus(status.value)"
              :group="{ name: 'tasks', pull: 'clone', put: ['tasks'] }"
              :data-status="status.value"
              @change="onStatusChange($event, status.value)"
              item-key="id"
              class="task-list"
              :class="{ 'empty-drop-zone': getTasksByStatus(status.value).length === 0 }"
              :style="{ minHeight: '100px' }"
            >
              <template #item="{ element }">
                <div class="task-card mb-2">
                  <v-card
                    @click="viewTask(element.id)"
                    class="task-item"
                    :color="element.priority === 'URGENT' ? 'red-lighten-4' : 'white'"
                    elevation="1"
                  >
                    <v-card-title class="pb-2 pt-2">
                      <div class="d-flex align-center">
                        <v-icon size="small" :color="getPriorityColor(element.priority)">
                          {{ getPriorityIcon(element.priority) }}
                        </v-icon>
                        <span class="ml-2">{{ element.title }}</span>
                      </div>
                    </v-card-title>
                    <v-card-subtitle v-if="element.assigneeName" class="pb-2 pt-0">
                      {{ element.assigneeName }}
                    </v-card-subtitle>
                    <v-card-text class="pb-2 pt-0 text-caption">
                      {{ element.description || 'No description' }}
                    </v-card-text>
                    <v-card-actions class="pt-2">
                      <v-chip
                        size="x-small"
                        :color="getPriorityColor(element.priority)"
                        variant="outlined"
                      >
                        {{ element.priority }}
                      </v-chip>
                    </v-card-actions>
                  </v-card>
                </div>
              </template>
            </draggable>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import type { Task } from '@/types/task'
import { useRouter } from 'vue-router'
import taskService from '@/services/taskService'

interface Props {
  tasks: Task[]
  projectId: string
}

const props = defineProps<Props>()

const router = useRouter()

const statuses = [
  { title: 'To Do', value: 'TODO' },
  { title: 'In Progress', value: 'IN_PROGRESS' },
  { title: 'Review', value: 'REVIEW' },
  { title: 'Done', value: 'DONE' },
]

const getTasksByStatus = (status: string) => {
  return props.tasks.filter((task) => task.status === status)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'TODO':
      return '#90a4ae' // Blue Grey
    case 'IN_PROGRESS':
      return '#42a5f5' // Light Blue
    case 'REVIEW':
      return '#ffca28' // Amber
    case 'DONE':
      return '#66bb6a' // Light Green
    default:
      return '#90a4ae'
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
      return 'info'
  }
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'LOW':
      return 'mdi-arrow-down'
    case 'MEDIUM':
      return 'mdi-arrow-split-horizontal'
    case 'HIGH':
      return 'mdi-arrow-up'
    case 'URGENT':
      return 'mdi-alert'
    default:
      return 'mdi-help'
  }
}

const onStatusChange = (event: any, newStatus: string) => {
  if (event.moved) {
    // Task was moved between columns
    const task = event.moved.element
    updateTaskStatus(task.id, newStatus)
  } else if (event.added) {
    // Task was added to this column
    const task = event.added.element
    updateTaskStatus(task.id, newStatus)
  }
}

const emit = defineEmits<{ (e: 'update:tasks', tasks: Task[]): void }>()

const updateTaskStatus = async (taskId: string, newStatus: string) => {
  try {
    // Update the task status via API call
    const updatedTask = await taskService.update(taskId, { status: newStatus as any })

    // Update the local state to reflect the change
    const updatedTasks = props.tasks.map((task) =>
      task.id === taskId ? { ...task, status: updatedTask.status } : task,
    )

    // Emit the updated tasks to parent component
    emit('update:tasks', updatedTasks)

    console.log(`Successfully updated task ${taskId} to status: ${newStatus}`)
  } catch (error) {
    console.error('Failed to update task status:', error)
    // Optionally: show error notification and revert the change
  }
}

const viewTask = (taskId: string) => {
  router.push(`/app/tasks/${taskId}`)
}
</script>

<style scoped>
.kanban-column {
  height: 100%;
  min-height: 500px;
}

.task-list {
  min-height: 100px;
}

.empty-drop-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.task-card {
  cursor: move;
}

.task-item {
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}
</style>
