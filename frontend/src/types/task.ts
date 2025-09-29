export interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  creatorId: string
  creatorName?: string
  assigneeId?: string
  assigneeName?: string
  projectId: string // Required field
  projectName?: string // New field for project name
  createdAt: string
  updatedAt: string
}
