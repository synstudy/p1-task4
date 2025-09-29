import { generateUUIDv6 } from '../../utils/uuid.util';

export class Comment {
  id: string;
  content: string;
  authorId: string;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    content: string,
    authorId: string,
    taskId: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.content = content;
    this.authorId = authorId;
    this.taskId = taskId;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(content: string, authorId: string, taskId: string): Comment {
    const id = generateUUIDv6(); // Generate UUID v6 for new comments
    const now = new Date();
    return new Comment(id, content, authorId, taskId, now, now);
  }

  updateContent(newContent: string): this {
    this.content = newContent;
    this.updatedAt = new Date();
    return this;
  }
}
