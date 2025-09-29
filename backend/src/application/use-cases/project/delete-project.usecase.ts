import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from '../../../domain/repositories/project.repository';

@Injectable()
export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string): Promise<boolean> {
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    const result = await this.projectRepository.delete(id);
    return result;
  }
}
