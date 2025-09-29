import { TaskStatus, Priority } from '@prisma/client';
import { generateUUIDv6 } from '../../utils/uuid.util';

export interface ProjectInfo {
  id: string;
  name: string;
}

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export class Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  creatorId: string;
  creatorName?: string; // Include creator name for better UX
  assigneeId: string | null;
  assigneeName?: string; // Include assignee name for better UX
  projectId: string;
  projectName?: string; // Include project name for better UX
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    title: string,
    creatorId: string,
    projectId: string,
    description: string | null,
    status: TaskStatus = 'TODO',
    priority: Priority = 'MEDIUM',
    assigneeId: string | null,
    projectName?: string,
    creatorName?: string,
    assigneeName?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.creatorId = creatorId;
    this.creatorName = creatorName;
    this.assigneeId = assigneeId;
    this.assigneeName = assigneeName;
    this.projectId = projectId;
    this.projectName = projectName;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(
    title: string,
    creatorId: string,
    projectId: string,
    description: string | null,
    priority: Priority = 'MEDIUM',
    projectName?: string,
    creatorName?: string,
    assigneeName?: string,
  ): Task {
    const id = generateUUIDv6(); // Generate UUID v6 for new tasks
    const now = new Date();
    return new Task(
      id,
      title,
      creatorId,
      projectId,
      description,
      'TODO',
      priority,
      null,
      projectName,
      creatorName,
      assigneeName,
      now,
      now,
    );
  }

  updateDetails(title?: string, description?: string): this {
    if (title) this.title = title;
    if (description) this.description = description;
    this.updatedAt = new Date();
    return this;
  }

  changeStatus(newStatus: TaskStatus): this {
    this.status = newStatus;
    this.updatedAt = new Date();
    return this;
  }

  changePriority(newPriority: Priority): this {
    this.priority = newPriority;
    this.updatedAt = new Date();
    return this;
  }

  assignTo(assigneeId: string): this {
    this.assigneeId = assigneeId;
    this.updatedAt = new Date();
    return this;
  }

  unassign(): this {
    this.assigneeId = null;
    this.updatedAt = new Date();
    return this;
  }
}
