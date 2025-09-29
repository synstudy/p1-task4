import { Injectable } from '@nestjs/common';
import { Comment } from '../../../domain/entities/comment.entity';
import { CommentRepository } from '../../../domain/repositories/comment.repository';

@Injectable()
export class GetAllCommentsUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(): Promise<Comment[]> {
    const comments = await this.commentRepository.findAll();
    return comments;
  }
}
