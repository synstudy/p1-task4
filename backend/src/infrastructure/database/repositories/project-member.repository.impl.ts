import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProjectMember } from '../../../domain/entities/project-member.entity';
import { generateUUIDv6 } from '../../../utils/uuid.util';
import {
  ProjectMemberRepository,
  ProjectMemberCreateInput,
  ProjectMemberUpdateInput,
  ProjectMemberWhereInput,
} from '../../../domain/repositories/project-member.repository';

@Injectable()
export class ProjectMemberRepositoryImpl extends ProjectMemberRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(projectMember: ProjectMemberCreateInput): Promise<ProjectMember> {
    // Generate UUID v6 for the new project member ID
    const id = generateUUIDv6();

    const data = await this.prisma.projectMember.create({
      data: {
        id,
        userId: projectMember.userId,
        projectId: projectMember.projectId,
        assignedById: projectMember.assignedById,
        role: projectMember.role,
      },
    });

    return new ProjectMember(
      data.id,
      data.userId,
      data.projectId,
      data.assignedById,
      data.role,
      data.assignedAt,
    );
  }

  async findById(id: string): Promise<ProjectMember | null> {
    const data = await this.prisma.projectMember.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new ProjectMember(
      data.id,
      data.userId,
      data.projectId,
      data.assignedById,
      data.role,
      data.assignedAt,
    );
  }

  async findByUserIdAndProjectId(where: ProjectMemberWhereInput): Promise<ProjectMember | null> {
    const data = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: where.userId,
          projectId: where.projectId,
        },
      },
    });

    if (!data) return null;

    return new ProjectMember(
      data.id,
      data.userId,
      data.projectId,
      data.assignedById,
      data.role,
      data.assignedAt,
    );
  }

  async findByProjectId(projectId: string): Promise<ProjectMember[]> {
    const data = await this.prisma.projectMember.findMany({
      where: { projectId },
    });

    return data.map(
      (projectMember) =>
        new ProjectMember(
          projectMember.id,
          projectMember.userId,
          projectMember.projectId,
          projectMember.assignedById,
          projectMember.role,
          projectMember.assignedAt,
        ),
    );
  }

  async findByUserId(userId: string): Promise<ProjectMember[]> {
    const data = await this.prisma.projectMember.findMany({
      where: { userId },
    });

    return data.map(
      (projectMember) =>
        new ProjectMember(
          projectMember.id,
          projectMember.userId,
          projectMember.projectId,
          projectMember.assignedById,
          projectMember.role,
          projectMember.assignedAt,
        ),
    );
  }

  async update(id: string, projectMember: ProjectMemberUpdateInput): Promise<ProjectMember> {
    const data = await this.prisma.projectMember.update({
      where: { id },
      data: {
        ...(projectMember.role !== undefined && { role: projectMember.role }),
      },
    });

    return new ProjectMember(
      data.id,
      data.userId,
      data.projectId,
      data.assignedById,
      data.role,
      data.assignedAt,
    );
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.projectMember.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
