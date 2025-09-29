import { Injectable } from '@nestjs/common';
import { Project } from '../../../domain/entities/project.entity';
import { ProjectRepository } from '../../../domain/repositories/project.repository';

@Injectable()
export class GetAllProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(): Promise<Project[]> {
    const projects = await this.projectRepository.findAll();
    return projects;
  }
}
