import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateProjectDto } from '../../application/dto/create-project.dto';
import { UpdateProjectDto } from '../../application/dto/update-project.dto';
import { CreateProjectUseCase } from '../../application/use-cases/project/create-project.usecase';
import { DeleteProjectUseCase } from '../../application/use-cases/project/delete-project.usecase';
import { GetAllProjectsUseCase } from '../../application/use-cases/project/get-all-projects.usecase';
import { GetProjectUseCase } from '../../application/use-cases/project/get-project.usecase';
import { GetProjectsByMemberUseCase } from '../../application/use-cases/project/get-projects-by-member.usecase';
import { GetProjectsByOwnerUseCase } from '../../application/use-cases/project/get-projects-by-owner.usecase';
import { UpdateProjectUseCase } from '../../application/use-cases/project/update-project.usecase';
import { Roles } from '../decorators/roles.decorator';
import { JwtPayload, User } from '../decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Controller('projects')
@UseGuards(AuthGuard, RolesGuard)
export class ProjectController {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly getProjectUseCase: GetProjectUseCase,
    private readonly getAllProjectsUseCase: GetAllProjectsUseCase,
    private readonly getProjectsByMemberUseCase: GetProjectsByMemberUseCase,
    private readonly getProjectsByOwnerUseCase: GetProjectsByOwnerUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
  ) {}

  @Post()
  @Roles('ADMIN')
  createProject(@User() user: JwtPayload, @Body() createProjectDto: CreateProjectDto) {
    return this.createProjectUseCase.execute(createProjectDto, user.sub);
  }

  @Get()
  @Roles('ADMIN', 'USER')
  getAllProjects(@User() user: JwtPayload) {
    // ADMIN users can see all projects
    if (user.role === 'ADMIN') {
      return this.getAllProjectsUseCase.execute();
    }
    // Regular USERs can only see projects they are members of
    return this.getProjectsByMemberUseCase.execute(user.sub);
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  getProject(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.getProjectUseCase.execute(id);
  }

  @Get('member/:memberId')
  @Roles('ADMIN', 'USER')
  getProjectsByMember(@Param('memberId', new ParseUUIDPipe()) memberId: string) {
    return this.getProjectsByMemberUseCase.execute(memberId);
  }

  @Roles('ADMIN')
  @Put(':id')
  updateProject(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.updateProjectUseCase.execute(id, updateProjectDto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  deleteProject(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.deleteProjectUseCase.execute(id);
  }
}
