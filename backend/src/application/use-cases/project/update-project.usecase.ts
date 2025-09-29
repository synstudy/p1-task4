import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from '../../../domain/entities/project.entity';
import { ProjectRepository } from '../../../domain/repositories/project.repository';

@Injectable()
export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string, updateData: Partial<Project>): Promise<Project> {
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new NotFoundException('Project not found');
    }

    const updatedProject = await this.projectRepository.update(id, updateData);
    return updatedProject;
  }
}
