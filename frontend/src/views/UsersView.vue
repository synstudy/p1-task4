<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Users</h1>
        <p v-if="authStore.isAdmin">Manage all system users here.</p>
        <p v-else-if="authStore.isManager">Manage users in your projects.</p>
        <p v-else>View users in your projects.</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="users" class="elevation-1" :loading="loading">
          <template v-slot:item.fullName="{ item }">
            {{ fullName(item) }}
          </template>

          <template v-slot:item.role="{ item }">
            <v-chip :color="getRoleColor(item.role)" label size="small">
              {{ item.role }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              size="small"
              variant="outlined"
              color="primary"
              @click="viewUser(item.id)"
              class="mr-2"
            >
              View
            </v-btn>
            <v-btn
              size="small"
              variant="outlined"
              color="warning"
              @click="editUser(item)"
              class="mr-2"
              v-if="canEditRole(item)"
            >
              Edit Role
            </v-btn>
            <v-btn
              size="small"
              variant="outlined"
              color="error"
              @click="deleteUser(item.id)"
              v-if="false"
            >
              Delete
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- Edit Role Dialog -->
    <v-dialog v-model="showEditRoleDialog" max-width="500px">
      <v-card>
        <v-card-title>Edit User Role</v-card-title>
        <v-card-text>
          <p>Editing role for: {{ editedUser ? fullName(editedUser) : '' }}</p>
          <v-select
            v-model="newRole"
            :items="availableRoles"
            label="New Role"
            :disabled="!authStore.isAdmin"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showEditRoleDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="updateUserRole" :loading="loading" :disabled="loading"
            >Update Role</v-btn
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
import userService from '@/services/userService'
import type { User } from '@/types/user'

const router = useRouter()
const authStore = useAuthStore()
const users = ref<User[]>([])
const loading = ref(false)
const showEditRoleDialog = ref(false)
const editedUser = ref<User | null>(null)
const newRole = ref<'USER' | 'ADMIN'>('USER')

// Computed headers based on role
const headers = computed(() => {
  const baseHeaders = [
    { title: 'Name', key: 'fullName' },
    { title: 'Email', key: 'email' },
    { title: 'Role', key: 'role' },
    { title: 'Actions', key: 'actions', sortable: false },
  ]

  // For non-admin users, hide the role column since they can't see all roles
  if (!authStore.isAdmin) {
    return baseHeaders.filter((h) => h.key !== 'role')
  }
  return baseHeaders
})

// Determine available roles based on current user's role
const availableRoles = computed(() => {
  if (authStore.isAdmin) {
    return [
      { title: 'User', value: 'USER' },
      { title: 'Admin', value: 'ADMIN' },
    ]
  } else if (authStore.isManager) {
    // Managers can only change to USER role (downgrade)
    return [
      { title: 'User', value: 'USER' },
      { title: 'Admin', value: 'ADMIN' },
    ]
  }
  return [] // Regular users can't change roles
})

onMounted(async () => {
  await loadUsers()
})

const loadUsers = async () => {
  try {
    loading.value = true

    if (authStore.isAdmin) {
      // Admin can see all users
      users.value = await userService.getAll()
    } else if (authStore.isManager) {
      // Manager can see all users with role USER
      const allUsers = await userService.getAll()
      users.value = allUsers.filter((user) => user.role === 'USER')
    } else if (authStore.isUser) {
      // Regular user can only see users from their projects
      // This would require getting the user's projects first
      // For now, we'll show an empty list or implement a different approach
      users.value = []
    }
  } catch (err) {
    console.error('Error loading users:', err)
  } finally {
    loading.value = false
  }
}

// Check if current user can edit another user's role
const canEditRole = (user: User) => {
  // Admin can edit any user's role except other admins
  if (authStore.isAdmin && user.role !== 'ADMIN') {
    return true
  }
  // Manager can edit user roles
  if (authStore.isManager && user.role === 'USER') {
    return true
  }
  return false
}

// Computed property to get full name
const fullName = (user: User) => `${user.firstName} ${user.lastName}`

const getRoleColor = (role: string) => {
  switch (role.toUpperCase()) {
    case 'ADMIN':
      return 'error'
    case 'USER':
      return 'success'
  }
}

const viewUser = (id: string) => {
  router.push(`/app/users/${id}`)
}

const editUser = (user: User) => {
  if (canEditRole(user)) {
    editedUser.value = user
    newRole.value = user.role
    showEditRoleDialog.value = true
  }
}

const updateUserRole = async () => {
  if (!editedUser.value) return

  try {
    loading.value = true
    await userService.updateRole(editedUser.value.id, newRole.value)
    showEditRoleDialog.value = false
    await loadUsers() // Refresh the list
  } catch (err) {
    console.error('Error updating user role:', err)
  } finally {
    loading.value = false
  }
}

const deleteUser = (id: string) => {
  console.log('Delete user:', id)
  // Implement delete functionality
}
</script>
