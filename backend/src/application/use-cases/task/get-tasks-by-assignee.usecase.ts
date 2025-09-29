import { Injectable } from '@nestjs/common';
import { Task } from '../../../domain/entities/task.entity';
import { TaskRepository } from '../../../domain/repositories/task.repository';

@Injectable()
export class GetTasksByAssigneeUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(assigneeId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.findByAssigneeId(assigneeId);
    return tasks;
  }
}
