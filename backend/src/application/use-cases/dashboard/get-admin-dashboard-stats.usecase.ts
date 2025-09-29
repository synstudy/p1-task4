import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../../domain/repositories/project.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { TaskRepository } from '../../../domain/repositories/task.repository';
import { ProjectMemberRepository } from '../../../domain/repositories/project-member.repository';

export interface AdminDashboardStats {
  totalProjects: number;
  totalUsers: number;
  totalTasks: number;
  activeProjects: number;
  completedTasks: number;
  usersByRole: Record<string, number>;
  tasksByStatus: Record<string, number>;
  projectsByStatus: Record<string, number>;
}

@Injectable()
export class GetAdminDashboardStatsUseCase {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly userRepository: UserRepository,
    private readonly taskRepository: TaskRepository,
    private readonly projectMemberRepository: ProjectMemberRepository,
  ) {}

  async execute(): Promise<AdminDashboardStats> {
    // Get counts
    const totalProjects = await this.projectRepository.count();
    const totalUsers = await this.userRepository.count();
    const totalTasks = await this.taskRepository.count();

    // Get active projects
    const activeProjects = await this.projectRepository.countByStatus('ACTIVE');

    // Get completed tasks
    const completedTasks = await this.taskRepository.countByStatus('DONE');

    // Get users by role
    const users = await this.userRepository.findAll();
    const usersByRole = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Get tasks by status
    const allTasks = await this.taskRepository.findAll();
    const tasksByStatus = allTasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Get projects by status
    const allProjects = await this.projectRepository.findAll();
    const projectsByStatus = allProjects.reduce(
      (acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalProjects,
      totalUsers,
      totalTasks,
      activeProjects,
      completedTasks,
      usersByRole,
      tasksByStatus,
      projectsByStatus,
    };
  }
}
