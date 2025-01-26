import { Module } from '@nestjs/common';
import { UsersService } from '../../application/services/users/users.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule.register()],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [],
})
export class UsersModule {}
