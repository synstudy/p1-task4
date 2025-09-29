import { Role } from '@prisma/client';
import { generateUUIDv6 } from '../../utils/uuid.util';

export class User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: Role = 'USER',
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: Role = 'USER',
  ): User {
    const id = generateUUIDv6(); // Generate UUID v6 for new users
    const now = new Date();
    return new User(id, email, password, firstName, lastName, role, now, now);
  }

  updateProfile(firstName: string, lastName: string): this {
    this.firstName = firstName;
    this.lastName = lastName;
    this.updatedAt = new Date();
    return this;
  }

  changeRole(newRole: Role): this {
    this.role = newRole;
    this.updatedAt = new Date();
    return this;
  }
}
