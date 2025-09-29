import { ProjectStatus } from '@prisma/client';
import { generateUUIDv6 } from '../../utils/uuid.util';

export class Project {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    ownerId: string,
    description: string | null,
    status: ProjectStatus = 'ACTIVE',
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.ownerId = ownerId;
    this.status = status;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(name: string, ownerId: string, description: string | null): Project {
    const id = generateUUIDv6(); // Generate UUID v6 for new projects
    const now = new Date();
    return new Project(id, name, ownerId, description, 'ACTIVE', now, now);
  }

  updateDetails(name?: string, description?: string): this {
    if (name) this.name = name;
    if (description) this.description = description;
    this.updatedAt = new Date();
    return this;
  }

  changeStatus(newStatus: ProjectStatus): this {
    this.status = newStatus;
    this.updatedAt = new Date();
    return this;
  }
}
