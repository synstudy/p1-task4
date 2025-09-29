import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from '../../../domain/entities/project.entity';
import { ProjectRepository } from '../../../domain/repositories/project.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { CreateProjectDto } from '../../dto/create-project.dto';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(createProjectDto: CreateProjectDto, ownerId: string): Promise<Project> {
    // Verify that the owner exists
    const owner = await this.userRepository.findById(ownerId);
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    // Create the project
    const project = await this.projectRepository.create({
      name: createProjectDto.name,
      description: createProjectDto.description,
      ownerId: ownerId,
    });

    return project;
  }
}
