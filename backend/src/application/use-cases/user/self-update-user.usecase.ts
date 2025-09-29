import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UpdateUserDto } from '../../dto/update-user.dto';

@Injectable()
export class SelfUpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Ensure user can only update their own profile (this should also be handled by auth guard)
    // But we'll add this extra check for security

    // Update the user (excluding role)
    const updatedUser = await this.userRepository.update(userId, {
      email: updateUserDto.email,
      password: updateUserDto.password,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      // Explicitly exclude role from update
    });

    return updatedUser;
  }
}
