import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create the user
    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || 'USER',
    });

    // Return the user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result as Omit<User, 'password'>;
  }
}
