import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '../../../domain/entities/user.entity';
import { generateUUIDv6 } from '../../../utils/uuid.util';
import {
  UserRepository,
  UserCreateInput,
  UserUpdateInput,
} from '../../../domain/repositories/user.repository';

@Injectable()
export class UserRepositoryImpl extends UserRepository {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(user: UserCreateInput): Promise<User> {
    // Generate UUID v6 for the new user ID
    const id = generateUUIDv6();

    const data = await this.prisma.user.create({
      data: {
        id,
        email: user.email,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });

    return new User(
      data.id,
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.role,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!data) return null;

    return new User(
      data.id,
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.role,
      data.createdAt,
      data.updatedAt,
    );
  }

  async findByIds(ids: string[]): Promise<User[]> {
    if (ids.length === 0) return [];

    const data = await this.prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return data.map(
      (user) =>
        new User(
          user.id,
          user.email,
          user.password,
          user.firstName,
          user.lastName,
          user.role,
          user.createdAt,
          user.updatedAt,
        ),
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!data) return null;

    return new User(
      data.id,
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.role,
      data.createdAt,
      data.updatedAt,
    );
  }

  async update(id: string, user: UserUpdateInput): Promise<User> {
    const data = await this.prisma.user.update({
      where: { id },
      data: {
        ...(user.email !== undefined && { email: user.email }),
        ...(user.password !== undefined && { password: user.password }),
        ...(user.firstName !== undefined && { firstName: user.firstName }),
        ...(user.lastName !== undefined && { lastName: user.lastName }),
        ...(user.role !== undefined && { role: user.role }),
      },
    });

    return new User(
      data.id,
      data.email,
      data.password,
      data.firstName,
      data.lastName,
      data.role,
      data.createdAt,
      data.updatedAt,
    );
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async findAll(): Promise<User[]> {
    const data = await this.prisma.user.findMany();

    return data.map(
      (user) =>
        new User(
          user.id,
          user.email,
          user.password,
          user.firstName,
          user.lastName,
          user.role,
          user.createdAt,
          user.updatedAt,
        ),
    );
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }
}
