import { Module } from '@nestjs/common';
import { AuthService } from '../../application/services/auth/auth.service';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('jwt.secret');
        const jwtExpiresIn = configService.get<string>('jwt.expiresIn');

        if (!jwtSecret) {
          throw new Error(
            'JWT_SECRET must be defined in environment variables',
          );
        }

        return {
          global: true,
          secret: jwtSecret,
          signOptions: {
            expiresIn: jwtExpiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
