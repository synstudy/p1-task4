import { Injectable } from '@nestjs/common';
import { ProjectMemberRepository } from '../../../domain/repositories/project-member.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { ProjectMemberWithUser } from '../../types/project-member-with-user.type';
import { User } from '@prisma/client';

@Injectable()
export class GetProjectMembersUseCase {
  constructor(
    private readonly projectMemberRepository: ProjectMemberRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(projectId: string): Promise<ProjectMemberWithUser[]> {
    // Get all project members for the given project
    const projectMembers = await this.projectMemberRepository.findByProjectId(projectId);

    // Extract all unique user IDs that we need to fetch
    const userIds = new Set<string>();
    projectMembers.forEach((member) => {
      userIds.add(member.userId);
      userIds.add(member.assignedById);
    });

    // Batch fetch all users in a single query
    const userIdsArray = Array.from(userIds);
    const users = await this.userRepository.findByIds(userIdsArray);

    // Create a map for quick lookup
    const userMap = new Map<
      string,
      Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'role'>
    >();
    users.forEach((user) => {
      userMap.set(user.id, {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    });

    // Aggregate user information for each project member
    const projectMembersWithUsers: ProjectMemberWithUser[] = projectMembers.map((member) => {
      const user = userMap.get(member.userId);
      const assignedBy = userMap.get(member.assignedById);

      if (!user || !assignedBy) {
        // Handle case where user data is not found (should not happen in practice)
        throw new Error(`User data not found for member ${member.id}`);
      }

      return {
        id: member.id,
        userId: member.userId,
        projectId: member.projectId,
        role: member.role,
        assignedById: member.assignedById,
        assignedAt: member.assignedAt,
        user: user,
        assignedBy: assignedBy,
      };
    });

    return projectMembersWithUsers;
  }
}
