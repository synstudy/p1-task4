import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../../../domain/entities/task.entity';
import { TaskRepository } from '../../../domain/repositories/task.repository';

@Injectable()
export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string, updateData: Partial<Task>): Promise<Task> {
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    const updatedTask = await this.taskRepository.update(id, updateData);
    return updatedTask;
  }
}
