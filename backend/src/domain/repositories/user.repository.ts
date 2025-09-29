import { User } from '../entities/user.entity';
import { Role } from '@prisma/client';

export interface UserCreateInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface UserUpdateInput {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
}

export abstract class UserRepository {
  abstract create(user: UserCreateInput): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByIds(ids: string[]): Promise<User[]>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract update(id: string, user: UserUpdateInput): Promise<User>;
  abstract delete(id: string): Promise<boolean>;
  abstract findAll(): Promise<User[]>;
  abstract count(): Promise<number>;
}
