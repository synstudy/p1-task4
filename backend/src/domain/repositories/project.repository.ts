import { Project } from '../entities/project.entity';
import { ProjectStatus } from '@prisma/client';

export interface ProjectCreateInput {
  name: string;
  description?: string;
  ownerId: string;
  status?: ProjectStatus;
}

export interface ProjectUpdateInput {
  name?: string;
  description?: string | null;
  status?: ProjectStatus;
}

export abstract class ProjectRepository {
  abstract create(project: ProjectCreateInput): Promise<Project>;
  abstract findById(id: string): Promise<Project | null>;
  abstract findAll(): Promise<Project[]>;
  abstract findByOwnerId(ownerId: string): Promise<Project[]>;
  abstract findByMemberId(memberId: string): Promise<Project[]>;
  abstract findWithRoleByMemberId(memberId: string): Promise<Array<Project & { role: string }>>;
  abstract update(id: string, project: ProjectUpdateInput): Promise<Project>;
  abstract delete(id: string): Promise<boolean>;
  abstract count(): Promise<number>;
  abstract countByStatus(status: string): Promise<number>;
}
