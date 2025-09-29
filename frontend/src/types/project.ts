export interface Project {
  id: string
  name: string
  description?: string
  ownerId: string
  ownerName: string
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}
