import { Injectable } from '@nestjs/common';
import { Task } from '../../../domain/entities/task.entity';
import { TaskRepository } from '../../../domain/repositories/task.repository';

@Injectable()
export class GetTasksByProjectUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(projectId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.findByProjectId(projectId);
    return tasks;
  }
}
