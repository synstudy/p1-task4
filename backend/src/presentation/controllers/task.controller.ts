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
import { CreateTaskDto } from '../../application/dto/create-task.dto';
import { UpdateTaskDto } from '../../application/dto/update-task.dto';
import { CreateTaskUseCase } from '../../application/use-cases/task/create-task.usecase';
import { DeleteTaskUseCase } from '../../application/use-cases/task/delete-task.usecase';
import { GetAllTasksUseCase } from '../../application/use-cases/task/get-all-tasks.usecase';
import { GetTaskUseCase } from '../../application/use-cases/task/get-task.usecase';
import { GetTasksByAssigneeUseCase } from '../../application/use-cases/task/get-tasks-by-assignee.usecase';
import { GetTasksByCreatorUseCase } from '../../application/use-cases/task/get-tasks-by-creator.usecase';
import { GetTasksByProjectUseCase } from '../../application/use-cases/task/get-tasks-by-project.usecase';
import { UpdateTaskUseCase } from '../../application/use-cases/task/update-task.usecase';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard)
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTaskUseCase: GetTaskUseCase,
    private readonly getAllTasksUseCase: GetAllTasksUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly getTasksByProjectUseCase: GetTasksByProjectUseCase,
    private readonly getTasksByAssigneeUseCase: GetTasksByAssigneeUseCase,
    private readonly getTasksByCreatorUseCase: GetTasksByCreatorUseCase,
  ) {}

  @Post()
  @Roles('ADMIN', 'USER')
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.createTaskUseCase.execute(createTaskDto);
  }

  @Get()
  @Roles('ADMIN', 'USER')
  getAllTask() {
    return this.getAllTasksUseCase.execute();
  }

  @Get('project/:projectId')
  @Roles('ADMIN', 'USER')
  getTasksByProject(@Param('projectId', new ParseUUIDPipe()) projectId: string) {
    return this.getTasksByProjectUseCase.execute(projectId);
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  getTask(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.getTaskUseCase.execute(id);
  }

  @Get('assignee/:assigneeId')
  @Roles('ADMIN', 'USER')
  getTasksByAssignee(@Param('assigneeId', new ParseUUIDPipe()) assigneeId: string) {
    return this.getTasksByAssigneeUseCase.execute(assigneeId);
  }

  @Get('creator/:creatorId')
  @Roles('ADMIN', 'USER')
  getTasksByCreator(@Param('creatorId', new ParseUUIDPipe()) creatorId: string) {
    return this.getTasksByCreatorUseCase.execute(creatorId);
  }

  @Put(':id')
  @Roles('ADMIN')
  updateTask(@Param('id', new ParseUUIDPipe()) id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.updateTaskUseCase.execute(id, updateTaskDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  deleteTask(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.deleteTaskUseCase.execute(id);
  }
}
