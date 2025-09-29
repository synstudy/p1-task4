import { Injectable } from '@nestjs/common';
import { ProjectMemberRepository } from '../../../domain/repositories/project-member.repository';
import { TaskRepository } from '../../../domain/repositories/task.repository';
import { ProjectRepository } from '../../../domain/repositories/project.repository';

export interface UserDashboardStats {
  projectsCount: number;
  assignedTasksCount: number;
  completedTasksCount: number;
  inProgressTasksCount: number;
  overdueTasksCount: number;
  projectsByRole: Record<string, number>;
}

@Injectable()
export class GetUserDashboardStatsUseCase {
  constructor(
    private readonly projectMemberRepository: ProjectMemberRepository,
    private readonly taskRepository: TaskRepository,
    private readonly projectRepository: ProjectRepository,
  ) {}

  async execute(userId: string): Promise<UserDashboardStats> {
    // Get projects where user is a member
    const projectMemberships = await this.projectMemberRepository.findByUserId(userId);
    const projectIds = projectMemberships.map((member) => member.projectId);

    // Count projects by role
    const projectsByRole: Record<string, number> = {};
    projectMemberships.forEach((member) => {
      projectsByRole[member.role] = (projectsByRole[member.role] || 0) + 1;
    });

    // Get tasks assigned to the user
    const assignedTasks = await this.taskRepository.findByAssigneeId(userId);

    // Calculate task statistics
    const completedTasksCount = assignedTasks.filter((task) => task.status === 'DONE').length;
    const inProgressTasksCount = assignedTasks.filter(
      (task) => task.status === 'IN_PROGRESS' || task.status === 'REVIEW',
    ).length;

    // For overdue tasks, we would need due dates in the future implementation
    // For now, we'll return 0
    const overdueTasksCount = 0;

    return {
      projectsCount: projectIds.length,
      assignedTasksCount: assignedTasks.length,
      completedTasksCount,
      inProgressTasksCount,
      overdueTasksCount,
      projectsByRole,
    };
  }
}
