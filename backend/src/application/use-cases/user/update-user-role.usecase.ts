import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';

export interface UpdateUserRoleInput {
  role: 'ADMIN' | 'USER';
}

@Injectable()
export class UpdateUserRoleUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, input: UpdateUserRoleInput): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Update user's role
    const updatedUser = await this.userRepository.update(userId, {
      role: input.role,
    });

    return updatedUser;
  }
}
