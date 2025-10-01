export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'USER'
  createdAt?: string
  updatedAt?: string
}
