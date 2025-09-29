import { Role } from '@prisma/client';

export interface UserCreateDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface UserUpdateDto {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

export interface UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
