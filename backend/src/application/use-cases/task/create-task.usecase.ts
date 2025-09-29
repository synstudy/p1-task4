import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../../../domain/entities/task.entity';
import { TaskRepository } from '../../../domain/repositories/task.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { ProjectRepository } from '../../../domain/repositories/project.repository';
import { CreateTaskDto } from '../../dto/create-task.dto';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(createTaskDto: CreateTaskDto): Promise<Task> {
    // Verify that the creator exists
    const creator = await this.userRepository.findById(createTaskDto.creatorId);
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    // Verify that the project exists
    const project = await this.projectRepository.findById(createTaskDto.projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // If assignee is provided, verify that the assignee exists
    if (createTaskDto.assigneeId) {
      const assignee = await this.userRepository.findById(createTaskDto.assigneeId);
      if (!assignee) {
        throw new NotFoundException('Assignee not found');
      }
    }

    // Create the task
    const task = await this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status,
      priority: createTaskDto.priority,
      creatorId: createTaskDto.creatorId,
      assigneeId: createTaskDto.assigneeId,
      projectId: createTaskDto.projectId,
    });

    return task;
  }
}
