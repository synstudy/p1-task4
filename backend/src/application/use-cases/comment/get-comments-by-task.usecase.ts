import { Injectable } from '@nestjs/common';
import { Comment } from '../../../domain/entities/comment.entity';
import { CommentRepository } from '../../../domain/repositories/comment.repository';

@Injectable()
export class GetCommentsByTaskUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(taskId: string): Promise<Comment[]> {
    const comments = await this.commentRepository.findByTaskId(taskId);
    return comments;
  }
}
