import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './application/services/auth.service';
import { CreateCommentUseCase } from './application/use-cases/comment/create-comment.usecase';
import { DeleteCommentUseCase } from './application/use-cases/comment/delete-comment.usecase';
import { GetAllCommentsUseCase } from './application/use-cases/comment/get-all-comments.usecase';
import { GetCommentsByTaskUseCase } from './application/use-cases/comment/get-comments-by-task.usecase';
import { UpdateCommentUseCase } from './application/use-cases/comment/update-comment.usecase';
import { AddUserToProjectUseCase } from './application/use-cases/project/add-user-to-project.usecase';
import { GetProjectMembersUseCase } from './application/use-cases/project-member/get-project-members.usecase';
import { CreateProjectUseCase } from './application/use-cases/project/create-project.usecase';
import { DeleteProjectUseCase } from './application/use-cases/project/delete-project.usecase';
import { GetAllProjectsUseCase } from './application/use-cases/project/get-all-projects.usecase';
import { GetProjectUseCase } from './application/use-cases/project/get-project.usecase';
import { GetProjectsByMemberUseCase } from './application/use-cases/project/get-projects-by-member.usecase';
import { GetProjectsByOwnerUseCase } from './application/use-cases/project/get-projects-by-owner.usecase';
import { UpdateProjectUseCase } from './application/use-cases/project/update-project.usecase';
import { CreateTaskUseCase } from './application/use-cases/task/create-task.usecase';
import { DeleteTaskUseCase } from './application/use-cases/task/delete-task.usecase';
import { GetAllTasksUseCase } from './application/use-cases/task/get-all-tasks.usecase';
import { GetTaskUseCase } from './application/use-cases/task/get-task.usecase';
import { GetTasksByAssigneeUseCase } from './application/use-cases/task/get-tasks-by-assignee.usecase';
import { GetTasksByCreatorUseCase } from './application/use-cases/task/get-tasks-by-creator.usecase';
import { GetTasksByProjectUseCase } from './application/use-cases/task/get-tasks-by-project.usecase';
import { UpdateTaskUseCase } from './application/use-cases/task/update-task.usecase';
import { CreateUserUseCase } from './application/use-cases/user/create-user.usecase';
import { GetAllUsersUseCase } from './application/use-cases/user/get-all-users.usecase';
import { GetUserUseCase } from './application/use-cases/user/get-user.usecase';
import { AdminUpdateUserUseCase } from './application/use-cases/user/admin-update-user.usecase';
import { SelfUpdateUserUseCase } from './application/use-cases/user/self-update-user.usecase';
import { UpdateUserRoleUseCase } from './application/use-cases/user/update-user-role.usecase';
import { GetAdminDashboardStatsUseCase } from './application/use-cases/dashboard/get-admin-dashboard-stats.usecase';
import { GetUserDashboardStatsUseCase } from './application/use-cases/dashboard/get-user-dashboard-stats.usecase';
import { CommentRepository } from './domain/repositories/comment.repository';
import { ProjectMemberRepository } from './domain/repositories/project-member.repository';
import { ProjectRepository } from './domain/repositories/project.repository';
import { TaskRepository } from './domain/repositories/task.repository';
import { UserRepository } from './domain/repositories/user.repository';
import configuration from './infrastructure/config/configuration';
import { PrismaService } from './infrastructure/database/prisma.service';
import { CommentRepositoryImpl } from './infrastructure/database/repositories/comment.repository.impl';
import { ProjectMemberRepositoryImpl } from './infrastructure/database/repositories/project-member.repository.impl';
import { ProjectRepositoryImpl } from './infrastructure/database/repositories/project.repository.impl';
import { TaskRepositoryImpl } from './infrastructure/database/repositories/task.repository.impl';
import { UserRepositoryImpl } from './infrastructure/database/repositories/user.repository.impl';
import { CommentController } from './presentation/controllers/comment.controller';
import { ProjectMemberController } from './presentation/controllers/project-member.controller';
import { ProjectController } from './presentation/controllers/project.controller';
import { TaskController } from './presentation/controllers/task.controller';
import { UserController } from './presentation/controllers/user.controller';
import { DashboardController } from './presentation/controllers/dashboard.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '60m' },
    }),
  ],
  controllers: [
    UserController,
    ProjectController,
    TaskController,
    CommentController,
    ProjectMemberController,
    DashboardController,
  ],
  providers: [
    PrismaService,
    AuthService,
    // User Use Cases
    CreateUserUseCase,
    GetUserUseCase,
    GetAllUsersUseCase,
    AdminUpdateUserUseCase,
    SelfUpdateUserUseCase,
    // Project Use Cases
    CreateProjectUseCase,
    GetProjectUseCase,
    GetAllProjectsUseCase,
    GetProjectsByOwnerUseCase,
    {
      provide: GetProjectsByMemberUseCase,
      useFactory: (prisma: PrismaService) => new GetProjectsByMemberUseCase(prisma),
      inject: [PrismaService],
    },
    UpdateProjectUseCase,
    DeleteProjectUseCase,
    AddUserToProjectUseCase,
    GetProjectMembersUseCase,
    // Task Use Cases
    CreateTaskUseCase,
    GetTaskUseCase,
    GetAllTasksUseCase,
    GetTasksByProjectUseCase,
    GetTasksByAssigneeUseCase,
    GetTasksByCreatorUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    // Comment Use Cases
    CreateCommentUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    GetAllCommentsUseCase,
    GetCommentsByTaskUseCase,
    // Dashboard Use Cases
    GetAdminDashboardStatsUseCase,
    GetUserDashboardStatsUseCase,
    // User Management Use Cases
    UpdateUserRoleUseCase,
    // Repositories
    { provide: UserRepository, useClass: UserRepositoryImpl },
    { provide: ProjectRepository, useClass: ProjectRepositoryImpl },
    { provide: TaskRepository, useClass: TaskRepositoryImpl },
    { provide: CommentRepository, useClass: CommentRepositoryImpl },
    { provide: ProjectMemberRepository, useClass: ProjectMemberRepositoryImpl },
    // Guards
  ],
  exports: [
    PrismaService,
    AuthService,
    // User Use Cases
    CreateUserUseCase,
    GetUserUseCase,
    GetAllUsersUseCase,
    AdminUpdateUserUseCase,
    SelfUpdateUserUseCase,
    // Project Use Cases
    CreateProjectUseCase,
    GetProjectUseCase,
    GetAllProjectsUseCase,
    GetProjectsByOwnerUseCase,
    {
      provide: GetProjectsByMemberUseCase,
      useFactory: (prisma: PrismaService) => new GetProjectsByMemberUseCase(prisma),
      inject: [PrismaService],
    },
    UpdateProjectUseCase,
    DeleteProjectUseCase,
    AddUserToProjectUseCase,
    GetProjectMembersUseCase,
    // Task Use Cases
    CreateTaskUseCase,
    GetTaskUseCase,
    GetAllTasksUseCase,
    GetTasksByProjectUseCase,
    GetTasksByAssigneeUseCase,
    GetTasksByCreatorUseCase,
    UpdateTaskUseCase,
    DeleteTaskUseCase,
    // Comment Use Cases
    CreateCommentUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
    GetAllCommentsUseCase,
    GetCommentsByTaskUseCase,
    // Dashboard Use Cases
    GetAdminDashboardStatsUseCase,
    GetUserDashboardStatsUseCase,
    // User Management Use Cases
    UpdateUserRoleUseCase,
    // Repositories
    { provide: UserRepository, useClass: UserRepositoryImpl },
    { provide: ProjectRepository, useClass: ProjectRepositoryImpl },
    { provide: TaskRepository, useClass: TaskRepositoryImpl },
    { provide: CommentRepository, useClass: CommentRepositoryImpl },
    { provide: ProjectMemberRepository, useClass: ProjectMemberRepositoryImpl },
  ],
})
export class AppModule {}
