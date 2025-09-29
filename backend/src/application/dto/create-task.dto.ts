import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus, Priority } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsEnum(Priority)
  priority?: Priority;

  @IsString()
  creatorId: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsString()
  projectId: string;
}
