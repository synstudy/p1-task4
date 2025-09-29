import { Role, ProjectStatus, TaskStatus, Priority, ProjectMemberRole } from '@prisma/client';

export interface UserEntity {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  changeRole?(newRole: Role): UserEntity;
}

export interface ProjectEntity {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  updateDetails?(name?: string, description?: string): ProjectEntity;
  changeStatus?(newStatus: ProjectStatus): ProjectEntity;
}

export interface ProjectMemberEntity {
  id: string;
  userId: string;
  projectId: string;
  role: ProjectMemberRole;
  assignedById: string;
  assignedAt: Date;
}

export interface TaskEntity {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  creatorId: string;
  assigneeId?: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  updateDetails?(title?: string, description?: string): TaskEntity;
  changeStatus?(newStatus: TaskStatus): TaskEntity;
  changePriority?(newPriority: Priority): TaskEntity;
  assignTo?(assigneeId: string): TaskEntity;
  unassign?(): TaskEntity;
}

export interface CommentEntity {
  id: string;
  content: string;
  authorId: string;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
  updateContent?(newContent: string): CommentEntity;
}
