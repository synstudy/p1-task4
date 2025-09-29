import { TaskStatus, Priority } from '@prisma/client';
import { Task } from '../entities/task.entity';

export interface TaskCreateInput {
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: Priority;
  creatorId: string;
  assigneeId?: string | null;
  projectId: string;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: Priority;
  assigneeId?: string | null;
}

export abstract class TaskRepository {
  abstract create(task: TaskCreateInput): Promise<Task>;
  abstract findById(id: string): Promise<Task | null>;
  abstract findByProjectId(projectId: string): Promise<Task[]>;
  abstract findByAssigneeId(assigneeId: string): Promise<Task[]>;
  abstract findByCreatorId(creatorId: string): Promise<Task[]>;
  abstract update(id: string, task: TaskUpdateInput): Promise<Task>;
  abstract delete(id: string): Promise<boolean>;
  abstract findAll(): Promise<Task[]>;
  abstract count(): Promise<number>;
  abstract countByStatus(status: string): Promise<number>;
}
