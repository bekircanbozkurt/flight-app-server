import { Injectable, NotFoundException } from '@nestjs/common';
import { FirestoreService } from '../../../infrastructure/firebase/firestore.service';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class UsersService {
  private readonly collection = 'users';

  constructor(private readonly firestoreService: FirestoreService) {}

  /**
   * Find a user by their ID
   * @param id The user's ID
   * @returns The user if found
   * @throws NotFoundException if the user doesn't exist
   */
  async findOne(id: string): Promise<User> {
    const userData = await this.firestoreService.findById<Omit<User, 'id'>>(
      this.collection,
      id,
    );

    if (!userData) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return new User(userData);
  }

  /**
   * Find a user by their email address
   * @param email The user's email address
   * @returns The user if found
   * @throws NotFoundException if the user doesn't exist
   */
  async getUserByEmail(email: string): Promise<User> {
    const userData = await this.firestoreService.findByField<Omit<User, 'id'>>(
      this.collection,
      'email',
      email.toLowerCase(),
    );

    if (!userData) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return new User(userData);
  }
}
