import { ProjectMember } from '../entities/project-member.entity';
import { ProjectMemberRole } from '@prisma/client';

export interface ProjectMemberCreateInput {
  userId: string;
  projectId: string;
  assignedById: string;
  role: ProjectMemberRole;
}

export interface ProjectMemberUpdateInput {
  role?: ProjectMemberRole;
}

export interface ProjectMemberWhereInput {
  userId: string;
  projectId: string;
}

export abstract class ProjectMemberRepository {
  abstract create(projectMember: ProjectMemberCreateInput): Promise<ProjectMember>;
  abstract findById(id: string): Promise<ProjectMember | null>;
  abstract findByUserIdAndProjectId(where: ProjectMemberWhereInput): Promise<ProjectMember | null>;
  abstract findByProjectId(projectId: string): Promise<ProjectMember[]>;
  abstract findByUserId(userId: string): Promise<ProjectMember[]>;
  abstract update(id: string, projectMember: ProjectMemberUpdateInput): Promise<ProjectMember>;
  abstract delete(id: string): Promise<boolean>;
}
