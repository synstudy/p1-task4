import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../../../domain/entities/task.entity';
import { TaskRepository } from '../../../domain/repositories/task.repository';

@Injectable()
export class GetTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }
}
