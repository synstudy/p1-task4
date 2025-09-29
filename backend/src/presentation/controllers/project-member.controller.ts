import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { AddUserToProjectDto } from '../../application/dto/add-user-to-project.dto';
import { AddUserToProjectUseCase } from '../../application/use-cases/project/add-user-to-project.usecase';
import { GetProjectMembersUseCase } from '../../application/use-cases/project-member/get-project-members.usecase';
import { ProjectMemberWithUser } from '../../application/types/project-member-with-user.type';
import { Roles } from '../decorators/roles.decorator';
import { JwtPayload, User } from '../decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Controller('projects/:projectId/members')
@UseGuards(AuthGuard, RolesGuard)
export class ProjectMemberController {
  constructor(
    private readonly addUserToProjectUseCase: AddUserToProjectUseCase,
    private readonly getProjectMembersUseCase: GetProjectMembersUseCase,
  ) {}

  @Post()
  @Roles('ADMIN', 'USER')
  async addUserToProject(
    @User() user: JwtPayload,
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Body() addUserToProjectDto: AddUserToProjectDto,
  ) {
    // Get the assigning user from the authenticated user in the request
    const assigningUserId = user.sub; // 'sub' is the standard JWT claim for subject (user ID)

    const result = await this.addUserToProjectUseCase.execute(
      projectId,
      addUserToProjectDto.userId,
      assigningUserId,
      addUserToProjectDto.role,
    );

    return {
      message: 'User added to project successfully',
      data: result,
    };
  }

  @Get()
  @Roles('ADMIN', 'USER')
  getProjectMembers(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
  ): Promise<ProjectMemberWithUser[]> {
    return this.getProjectMembersUseCase.execute(projectId);
  }
}
