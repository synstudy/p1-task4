import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ProjectMember } from '../../../domain/entities/project-member.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { ProjectRepository } from '../../../domain/repositories/project.repository';
import { ProjectMemberRepository } from '../../../domain/repositories/project-member.repository';
import { ProjectMemberRole } from '@prisma/client';

@Injectable()
export class AddUserToProjectUseCase {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
    private readonly projectMemberRepository: ProjectMemberRepository,
  ) {}

  async execute(
    projectId: string,
    userId: string,
    assignedByUserId: string,
    role: ProjectMemberRole = 'WORKER',
  ): Promise<ProjectMember> {
    // Verify that the project exists
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Verify that the user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify that the assigning user exists
    const assigningUser = await this.userRepository.findById(assignedByUserId);
    if (!assigningUser) {
      throw new NotFoundException('Assigning user not found');
    }

    const existingMember = await this.projectMemberRepository.findByUserIdAndProjectId({
      userId,
      projectId,
    });
    if (existingMember) {
      throw new ConflictException('User is already a member of this project');
    }

    // Add the user to the project as a member
    const projectMember = await this.projectMemberRepository.create({
      userId,
      projectId,
      assignedById: assignedByUserId,
      role,
    });

    return projectMember;
  }
}
