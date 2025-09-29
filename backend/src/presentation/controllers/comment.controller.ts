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
import { CreateCommentDto } from '../../application/dto/create-comment.dto';
import { UpdateCommentDto } from '../../application/dto/update-comment.dto';
import { CreateCommentUseCase } from '../../application/use-cases/comment/create-comment.usecase';
import { DeleteCommentUseCase } from '../../application/use-cases/comment/delete-comment.usecase';
import { GetAllCommentsUseCase } from '../../application/use-cases/comment/get-all-comments.usecase';
import { GetCommentsByTaskUseCase } from '../../application/use-cases/comment/get-comments-by-task.usecase';
import { UpdateCommentUseCase } from '../../application/use-cases/comment/update-comment.usecase';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@Controller('comments')
@UseGuards(AuthGuard, RolesGuard)
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
    private readonly getAllCommentsUseCase: GetAllCommentsUseCase,
    private readonly getCommentsByTaskUseCase: GetCommentsByTaskUseCase,
  ) {}

  @Post()
  @Roles('ADMIN', 'USER')
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.createCommentUseCase.execute(createCommentDto);
  }

  @Get()
  @Roles('ADMIN')
  getAllComments() {
    return this.getAllCommentsUseCase.execute();
  }

  @Get('task/:taskId')
  @Roles('ADMIN', 'USER')
  getCommentsByTask(@Param('taskId', new ParseUUIDPipe()) taskId: string) {
    return this.getCommentsByTaskUseCase.execute(taskId);
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  async getComment(@Param('id', new ParseUUIDPipe()) id: string) {
    // For simplicity, we'll return a placeholder implementation
    // In a full implementation, we would have a GetCommentUseCase
    return { id, message: 'Comment details would be returned here' };
  }

  @Put(':id')
  @Roles('ADMIN')
  updateComment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.updateCommentUseCase.execute(id, updateCommentDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'USER')
  deleteComment(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.deleteCommentUseCase.execute(id);
  }
}
