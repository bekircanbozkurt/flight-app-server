import { Module } from '@nestjs/common';
import { UsersService } from '../../application/services/users/users.service';
import { FirestoreService } from '../firebase/firestore.service';

@Module({
  imports: [],
  providers: [UsersService, FirestoreService],
  exports: [UsersService],
})
export class UsersModule {}
