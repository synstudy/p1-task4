import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../../../domain/repositories/comment.repository';

@Injectable()
export class DeleteCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(id: string): Promise<boolean> {
    const existingComment = await this.commentRepository.findById(id);
    if (!existingComment) {
      throw new NotFoundException('Comment not found');
    }

    const result = await this.commentRepository.delete(id);
    return result;
  }
}
