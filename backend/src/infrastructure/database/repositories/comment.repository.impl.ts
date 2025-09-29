import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Comment } from '../../../domain/entities/comment.entity';
import { generateUUIDv6 } from '../../../utils/uuid.util';
import {
  CommentRepository,
  CommentCreateInput,
  CommentUpdateInput,
} from '../../../domain/repositories/comment.repository';

@Injectable()
export class CommentRepositoryImpl extends CommentRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(comment: CommentCreateInput): Promise<Comment> {
    // Generate UUID v6 for the new comment ID
    const id = generateUUIDv6();

    const data = await this.prisma.comment.create({
      data: {
        id,
        content: comment.content,
        authorId: comment.authorId,
        taskId: comment.taskId,
      },
    });

    return new Comment(
      data.id,
      data.content,
      data.authorId,
      data.taskId,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<Comment | null> {
    const data = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new Comment(
      data.id,
      data.content,
      data.authorId,
      data.taskId,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findByTaskId(taskId: string): Promise<Comment[]> {
    const data = await this.prisma.comment.findMany({
      where: { taskId },
    });

    return data.map(
      (comment) =>
        new Comment(
          comment.id,
          comment.content,
          comment.authorId,
          comment.taskId,
          comment.createdAt,
          comment.updatedAt,
        ),
    );
  }

  async findByAuthorId(authorId: string): Promise<Comment[]> {
    const data = await this.prisma.comment.findMany({
      where: { authorId },
    });

    return data.map(
      (comment) =>
        new Comment(
          comment.id,
          comment.content,
          comment.authorId,
          comment.taskId,
          comment.createdAt,
          comment.updatedAt,
        ),
    );
  }

  async update(id: string, comment: CommentUpdateInput): Promise<Comment> {
    const data = await this.prisma.comment.update({
      where: { id },
      data: {
        ...(comment.content !== undefined && { content: comment.content }),
      },
    });

    return new Comment(
      data.id,
      data.content,
      data.authorId,
      data.taskId,
      data.createdAt,
      data.updatedAt,
    );
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.comment.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<Comment[]> {
    const data = await this.prisma.comment.findMany();

    return data.map(
      (comment) =>
        new Comment(
          comment.id,
          comment.content,
          comment.authorId,
          comment.taskId,
          comment.createdAt,
          comment.updatedAt,
        ),
    );
  }
}
