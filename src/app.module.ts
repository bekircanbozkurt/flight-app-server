import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './infrastructure/auth/auth.module';
import { UsersModule } from './infrastructure/users/users.module';
import { FlightReservationsModule } from './infrastructure/flight-reservations/flight-reservations.module';
import jwtConfig from './infrastructure/config/jwt.config';
import databaseConfig from './infrastructure/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, databaseConfig],
    }),
    AuthModule,
    UsersModule,
    FlightReservationsModule,
  ],
  providers: [],
})
export class AppModule {}
