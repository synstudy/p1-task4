import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '../../../domain/entities/comment.entity';
import { CommentRepository } from '../../../domain/repositories/comment.repository';
import { TaskRepository } from '../../../domain/repositories/task.repository';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { CreateCommentDto } from '../../dto/create-comment.dto';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(createCommentDto: CreateCommentDto): Promise<Comment> {
    // Verify that the author exists
    const author = await this.userRepository.findById(createCommentDto.authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    // Verify that the task exists
    const task = await this.taskRepository.findById(createCommentDto.taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Create the comment
    const comment = await this.commentRepository.create({
      content: createCommentDto.content,
      authorId: createCommentDto.authorId,
      taskId: createCommentDto.taskId,
    });

    return comment;
  }
}
