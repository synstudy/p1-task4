import { ProjectMemberRole } from '@prisma/client';

export interface ProjectMemberWithUser {
  id: string;
  userId: string;
  projectId: string;
  role: ProjectMemberRole;
  assignedById: string;
  assignedAt: Date;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  assignedBy: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
