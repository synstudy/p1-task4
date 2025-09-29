import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Project } from '../../../domain/entities/project.entity';
import { generateUUIDv6 } from '../../../utils/uuid.util';
import {
  ProjectRepository,
  ProjectCreateInput,
  ProjectUpdateInput,
} from '../../../domain/repositories/project.repository';

@Injectable()
export class ProjectRepositoryImpl extends ProjectRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(project: ProjectCreateInput): Promise<Project> {
    // Generate UUID v6 for the new project ID
    const id = generateUUIDv6();

    const data = await this.prisma.project.create({
      data: {
        id,
        name: project.name,
        description: project.description,
        ownerId: project.ownerId,
        status: project.status || 'ACTIVE',
      },
    });

    return new Project(
      data.id,
      data.name,
      data.ownerId,
      data.description,
      data.status,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<Project | null> {
    const data = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new Project(
      data.id,
      data.name,
      data.ownerId,
      data.description,
      data.status,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findAll(): Promise<Project[]> {
    const data = await this.prisma.project.findMany();

    return data.map(
      (project) =>
        new Project(
          project.id,
          project.name,
          project.ownerId,
          project.description,
          project.status,
          project.createdAt,
          project.updatedAt,
        ),
    );
  }

  async findByOwnerId(ownerId: string): Promise<Project[]> {
    const data = await this.prisma.project.findMany({
      where: { ownerId },
    });

    return data.map(
      (project) =>
        new Project(
          project.id,
          project.name,
          project.ownerId,
          project.description,
          project.status,
          project.createdAt,
          project.updatedAt,
        ),
    );
  }

  async findByMemberId(memberId: string): Promise<Project[]> {
    const data = await this.prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: memberId,
          },
        },
      },
    });

    return data.map(
      (project) =>
        new Project(
          project.id,
          project.name,
          project.ownerId,
          project.description,
          project.status,
          project.createdAt,
          project.updatedAt,
        ),
    );
  }

  async findWithRoleByMemberId(memberId: string): Promise<Array<Project & { role: string }>> {
    // This method would require a more complex implementation to return the role
    // For now, we'll use a placeholder implementation
    const data = await this.prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: memberId,
          },
        },
      },
    });

    // Add a default role for now
    return data.map(
      (project) =>
        new Project(
          project.id,
          project.name,
          project.ownerId,
          project.description,
          project.status,
          project.createdAt,
          project.updatedAt,
        ) as Project & { role: 'UNKNOWN' },
    );
  }

  async update(id: string, project: ProjectUpdateInput): Promise<Project> {
    const data = await this.prisma.project.update({
      where: { id },
      data: {
        ...(project.name !== undefined && { name: project.name }),
        ...(project.description !== undefined && {
          description: project.description,
        }),
        ...(project.status !== undefined && { status: project.status }),
      },
    });

    return new Project(
      data.id,
      data.name,
      data.ownerId,
      data.description,
      data.status,
      data.createdAt,
      data.updatedAt,
    );
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.project.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async count(): Promise<number> {
    return this.prisma.project.count();
  }

  async countByStatus(status: string): Promise<number> {
    return this.prisma.project.count({
      where: { status: status as any },
    });
  }
}
