import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { DatabaseService } from '../../../infrastructure/database/database.interface';

@Injectable()
export class UsersService {
  private readonly collection = 'users';

  constructor(
    @Inject('DATABASE_SERVICE')
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * Find a user by their ID
   * @param id The user's ID
   * @returns The user if found
   * @throws NotFoundException if the user doesn't exist
   */
  async findOne(id: string): Promise<User> {
    const user = await this.databaseService.findOne<User>(
      this.collection,
      (user) => user.id === id,
    );

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return new User(user);
  }

  /**
   * Find a user by their email address
   * @param email The user's email address
   * @returns The user if found
   * @throws NotFoundException if the user doesn't exist
   */
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.databaseService.findOne<User>(
      this.collection,
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return new User(user);
  }
}
