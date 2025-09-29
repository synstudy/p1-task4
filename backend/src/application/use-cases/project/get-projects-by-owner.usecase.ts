import { Injectable } from '@nestjs/common';
import { Project } from '../../../domain/entities/project.entity';
import { ProjectRepository } from '../../../domain/repositories/project.repository';

@Injectable()
export class GetProjectsByOwnerUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(ownerId: string): Promise<Project[]> {
    const projects = await this.projectRepository.findByOwnerId(ownerId);
    return projects;
  }
}
