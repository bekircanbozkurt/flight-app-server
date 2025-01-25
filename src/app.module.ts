import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './infrastructure/auth/auth.module';
import { UsersModule } from './infrastructure/users/users.module';
import jwtConfig from './infrastructure/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [],
})
export class AppModule {}
