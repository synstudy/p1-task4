import { Comment } from '../entities/comment.entity';

export interface CommentCreateInput {
  content: string;
  authorId: string;
  taskId: string;
}

export interface CommentUpdateInput {
  content?: string;
}

export abstract class CommentRepository {
  abstract create(comment: CommentCreateInput): Promise<Comment>;
  abstract findById(id: string): Promise<Comment | null>;
  abstract findByTaskId(taskId: string): Promise<Comment[]>;
  abstract findByAuthorId(authorId: string): Promise<Comment[]>;
  abstract update(id: string, comment: CommentUpdateInput): Promise<Comment>;
  abstract delete(id: string): Promise<boolean>;
  abstract findAll(): Promise<Comment[]>;
}
