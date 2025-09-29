import { Injectable } from '@nestjs/common';
import { Task } from '../../../domain/entities/task.entity';
import { TaskRepository } from '../../../domain/repositories/task.repository';

@Injectable()
export class GetTasksByCreatorUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(creatorId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.findByCreatorId(creatorId);
    return tasks;
  }
}
