import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { ProjectWithRole } from '../../types/project-with-role.type';

@Injectable()
export class GetProjectsByMemberUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string): Promise<ProjectWithRole[]> {
    // Get projects where user is a member along with their role
    const projectMembers = await this.prisma.projectMember.findMany({
      where: {
        userId: userId,
      },
      include: {
        project: true,
      },
    });

    // Transform to ProjectWithRole format
    return projectMembers.map((pm) => ({
      id: pm.project.id,
      name: pm.project.name,
      description: pm.project.description,
      ownerId: pm.project.ownerId,
      status: pm.project.status,
      createdAt: pm.project.createdAt,
      updatedAt: pm.project.updatedAt,
      role: pm.role, // The user's role in this project
    }));
  }
}
