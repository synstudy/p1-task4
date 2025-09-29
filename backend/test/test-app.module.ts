import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../src/application/services/auth.service';
import { CreateCommentUseCase } from '../src/application/use-cases/comment/create-comment.usecase';
import { DeleteCommentUseCase } from '../src/application/use-cases/comment/delete-comment.usecase';
import { GetAllCommentsUseCase } from '../src/application/use-cases/comment/get-all-comments.usecase';
import { GetCommentsByTaskUseCase } from '../src/application/use-cases/comment/get-comments-by-task.usecase';
import { UpdateCommentUseCase } from '../src/application/use-cases/comment/update-comment.usecase';
import { AddUserToProjectUseCase } from '../src/application/use-cases/project/add-user-to-project.usecase';
import { GetProjectMembersUseCase } from '../src/application/use-cases/project-member/get-project-members.usecase';
import { CreateProjectUseCase } from '../src/application/use-cases/project/create-project.usecase';
import { DeleteProjectUseCase } from '../src/application/use-cases/project/delete-project.usecase';
import { GetAllProjectsUseCase } from '../src/application/use-cases/project/get-all-projects.usecase';
import { GetProjectUseCase } from '../src/application/use-cases/project/get-project.usecase';
import { GetProjectsByMemberUseCase } from '../src/application/use-cases/project/get-projects-by-member.usecase';
import { GetProjectsByOwnerUseCase } from '../src/application/use-cases/project/get-projects-by-owner.usecase';
import { UpdateProjectUseCase } from '../src/application/use-cases/project/update-project.usecase';
import { CreateTaskUseCase } from '../src/application/use-cases/task/create-task.usecase';
import { DeleteTaskUseCase } from '../src/application/use-cases/task/delete-task.usecase';
import { GetAllTasksUseCase } from '../src/application/use-cases/task/get-all-tasks.usecase';
import { GetTaskUseCase } from '../src/application/use-cases/task/get-task.usecase';
import { GetTasksByAssigneeUseCase } from '../src/application/use-cases/task/get-tasks-by-assignee.usecase';
import { GetTasksByCreatorUseCase } from '../src/application/use-cases/task/get-tasks-by-creator.usecase';
import { GetTasksByProjectUseCase } from '../src/application/use-cases/task/get-tasks-by-project.usecase';
import { UpdateTaskUseCase } from '../src/application/use-cases/task/update-task.usecase';
import { CreateUserUseCase } from '../src/application/use-cases/user/create-user.usecase';
import { GetAllUsersUseCase } from '../src/application/use-cases/user/get-all-users.usecase';
import { GetUserUseCase } from '../src/application/use-cases/user/get-user.usecase';
import { AdminUpdateUserUseCase } from '../src/application/use-cases/user/admin-update-user.usecase';
import { SelfUpdateUserUseCase } from '../src/application/use-cases/user/self-update-user.usecase';
import { UpdateUserRoleUseCase } from '../src/application/use-cases/user/update-user-role.usecase';
import { GetAdminDashboardStatsUseCase } from '../src/application/use-cases/dashboard/get-admin-dashboard-stats.usecase';
import { GetUserDashboardStatsUseCase } from '../src/application/use-cases/dashboard/get-user-dashboard-stats.usecase';
import { CommentRepository } from '../src/domain/repositories/comment.repository';
import { ProjectMemberRepository } from '../src/domain/repositories/project-member.repository';
import { ProjectRepository } from '../src/domain/repositories/project.repository';
import { TaskRepository } from '../src/domain/repositories/task.repository';
import { UserRepository } from '../src/domain/repositories/user.repository';
import { CommentRepositoryImpl } from '../src/infrastructure/database/repositories/comment.repository.impl';
import { ProjectMemberRepositoryImpl } from '../src/infrastructure/database/repositories/project-member.repository.impl';
import { ProjectRepositoryImpl } from '../src/infrastructure/database/repositories/project.repository.impl';
import { TaskRepositoryImpl } from '../src/infrastructure/database/repositories/task.repository.impl';
import { UserRepositoryImpl } from '../src/infrastructure/database/repositories/user.repository.impl';
import { CommentController } from '../src/presentation/controllers/comment.controller';
import { ProjectMemberController } from '../src/presentation/controllers/project-member.controller';
import { ProjectController } from '../src/presentation/controllers/project.controller';
import { TaskController } from '../src/presentation/controllers/task.controller';
import { UserController } from '../src/presentation/controllers/user.controller';
import { DashboardController } from '../src/presentation/controllers/dashboard.controller';

// Custom Prisma service for testing that doesn't depend on ConfigService
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

@Injectable()
export class TestPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    // Note: We'll connect manually after migrations are applied
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'test_secret_for_e2e_tests',
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
    {
      provide: PrismaService, // Use the class itself as token, not a string
      useClass: TestPrismaService,
    },
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
      useFactory: (prisma: TestPrismaService) => new GetProjectsByMemberUseCase(prisma),
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
  exports: [
    {
      provide: PrismaService,
      useClass: TestPrismaService,
    },
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
      useFactory: (prisma: TestPrismaService) => new GetProjectsByMemberUseCase(prisma),
      inject: [TestPrismaService],
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
export class TestAppModule {}