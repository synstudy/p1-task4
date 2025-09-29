import { Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/repositories/user.repository';

@Injectable()
export class GetAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.findAll();

    // Return users without passwords
    return users.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ password, ...userWithoutPassword }) => userWithoutPassword as Omit<User, 'password'>,
    );
  }
}
