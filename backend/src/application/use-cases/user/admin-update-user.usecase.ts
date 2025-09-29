import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { AdminUpdateUserDto } from '../../dto/admin-update-user.dto';

@Injectable()
export class AdminUpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, updateUserDto: AdminUpdateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Update the user
    const updatedUser = await this.userRepository.update(id, {
      email: updateUserDto.email,
      password: updateUserDto.password,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      role: updateUserDto.role,
    });

    return updatedUser;
  }
}
