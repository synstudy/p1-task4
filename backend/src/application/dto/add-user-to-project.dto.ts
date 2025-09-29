import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ProjectMemberRole } from '@prisma/client';

export class AddUserToProjectDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsEnum(ProjectMemberRole)
  role?: ProjectMemberRole;
}
