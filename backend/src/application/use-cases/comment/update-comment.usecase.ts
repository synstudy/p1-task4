import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from '../../../domain/entities/comment.entity';
import { CommentRepository } from '../../../domain/repositories/comment.repository';

@Injectable()
export class UpdateCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(id: string, updateData: Partial<Comment>): Promise<Comment> {
    const existingComment = await this.commentRepository.findById(id);
    if (!existingComment) {
      throw new NotFoundException('Comment not found');
    }

    const updatedComment = await this.commentRepository.update(id, updateData);
    return updatedComment;
  }
}
