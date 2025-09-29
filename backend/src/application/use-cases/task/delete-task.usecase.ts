import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from '../../../domain/repositories/task.repository';

@Injectable()
export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string): Promise<boolean> {
    const existingTask = await this.taskRepository.findById(id);
    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    const result = await this.taskRepository.delete(id);
    return result;
  }
}
