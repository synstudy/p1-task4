import { ProjectMemberRole } from '@prisma/client';

export class ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: ProjectMemberRole;
  assignedById: string;
  assignedAt: Date;

  constructor(
    id: string,
    userId: string,
    projectId: string,
    assignedById: string,
    role: ProjectMemberRole,
    assignedAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.projectId = projectId;
    this.assignedById = assignedById;
    this.role = role;
    this.assignedAt = assignedAt;
  }
}
