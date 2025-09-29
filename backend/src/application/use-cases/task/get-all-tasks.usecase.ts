import { Injectable } from '@nestjs/common';
import { Task } from '../../../domain/entities/task.entity';
import { TaskRepository } from '../../../domain/repositories/task.repository';

@Injectable()
export class GetAllTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    const tasks = await this.taskRepository.findAll();
    return tasks;
  }
}
