import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Task } from '../../../domain/entities/task.entity';
import { generateUUIDv6 } from '../../../utils/uuid.util';
import {
  TaskRepository,
  TaskCreateInput,
  TaskUpdateInput,
} from '../../../domain/repositories/task.repository';

@Injectable()
export class TaskRepositoryImpl extends TaskRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(task: TaskCreateInput): Promise<Task> {
    // Generate UUID v6 for the new task ID
    const id = generateUUIDv6();

    const data = await this.prisma.task.create({
      data: {
        id,
        title: task.title,
        description: task.description,
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        creatorId: task.creatorId,
        assigneeId: task.assigneeId,
        projectId: task.projectId,
      },
      include: {
        project: true,
        creator: true,
        assignee: true,
      },
    });

    return new Task(
      data.id,
      data.title,
      data.creatorId,
      data.projectId,
      data.description,
      data.status,
      data.priority,
      data.assigneeId,
      data.project.name, // Include project name
      `${data.creator.firstName} ${data.creator.lastName}`, // Include creator name
      data.assignee ? `${data.assignee.firstName} ${data.assignee.lastName}` : undefined, // Include assignee name
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<Task | null> {
    const data = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        creator: true,
        assignee: true,
      },
    });

    if (!data) return null;

    return new Task(
      data.id,
      data.title,
      data.creatorId,
      data.projectId,
      data.description,
      data.status,
      data.priority,
      data.assigneeId,
      data.project.name, // Include project name
      `${data.creator.firstName} ${data.creator.lastName}`, // Include creator name
      data.assignee ? `${data.assignee.firstName} ${data.assignee.lastName}` : undefined, // Include assignee name
      data.createdAt,
      data.updatedAt,
    );
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    const data = await this.prisma.task.findMany({
      where: { projectId },
      include: {
        project: true,
        creator: true,
        assignee: true,
      },
    });

    return data.map(
      (task) =>
        new Task(
          task.id,
          task.title,
          task.creatorId,
          task.projectId,
          task.description,
          task.status,
          task.priority,
          task.assigneeId,
          task.project.name, // Include project name
          `${task.creator.firstName} ${task.creator.lastName}`, // Include creator name
          task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : undefined, // Include assignee name
          task.createdAt,
          task.updatedAt,
        ),
    );
  }

  async findByAssigneeId(assigneeId: string): Promise<Task[]> {
    const data = await this.prisma.task.findMany({
      where: { assigneeId },
      include: {
        project: true,
        creator: true,
        assignee: true,
      },
    });

    return data.map(
      (task) =>
        new Task(
          task.id,
          task.title,
          task.creatorId,
          task.projectId,
          task.description,
          task.status,
          task.priority,
          task.assigneeId,
          task.project.name, // Include project name
          `${task.creator.firstName} ${task.creator.lastName}`, // Include creator name
          task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : undefined, // Include assignee name
          task.createdAt,
          task.updatedAt,
        ),
    );
  }

  async findByCreatorId(creatorId: string): Promise<Task[]> {
    const data = await this.prisma.task.findMany({
      where: { creatorId },
      include: {
        project: true,
        creator: true,
        assignee: true,
      },
    });

    return data.map(
      (task) =>
        new Task(
          task.id,
          task.title,
          task.creatorId,
          task.projectId,
          task.description,
          task.status,
          task.priority,
          task.assigneeId,
          task.project.name, // Include project name
          `${task.creator.firstName} ${task.creator.lastName}`, // Include creator name
          task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : undefined, // Include assignee name
          task.createdAt,
          task.updatedAt,
        ),
    );
  }

  async update(id: string, task: TaskUpdateInput): Promise<Task> {
    const data = await this.prisma.task.update({
      where: { id },
      data: {
        ...(task.title !== undefined && { title: task.title }),
        ...(task.description !== undefined && {
          description: task.description,
        }),
        ...(task.status !== undefined && { status: task.status }),
        ...(task.priority !== undefined && { priority: task.priority }),
        ...(task.assigneeId !== undefined && { assigneeId: task.assigneeId }),
      },
      include: {
        project: true,
        creator: true,
        assignee: true,
      },
    });

    return new Task(
      data.id,
      data.title,
      data.creatorId,
      data.projectId,
      data.description,
      data.status,
      data.priority,
      data.assigneeId,
      data.project.name, // Include project name
      `${data.creator.firstName} ${data.creator.lastName}`, // Include creator name
      data.assignee ? `${data.assignee.firstName} ${data.assignee.lastName}` : undefined, // Include assignee name
      data.createdAt,
      data.updatedAt,
    );
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.task.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<Task[]> {
    const data = await this.prisma.task.findMany({
      include: {
        project: true,
        creator: true,
        assignee: true,
      },
    });

    return data.map(
      (task) =>
        new Task(
          task.id,
          task.title,
          task.creatorId,
          task.projectId,
          task.description,
          task.status,
          task.priority,
          task.assigneeId,
          task.project.name, // Include project name
          `${task.creator.firstName} ${task.creator.lastName}`, // Include creator name
          task.assignee ? `${task.assignee.firstName} ${task.assignee.lastName}` : undefined, // Include assignee name
          task.createdAt,
          task.updatedAt,
        ),
    );
  }

  async count(): Promise<number> {
    return this.prisma.task.count();
  }

  async countByStatus(status: string): Promise<number> {
    return this.prisma.task.count({
      where: { status: status as any },
    });
  }
}
