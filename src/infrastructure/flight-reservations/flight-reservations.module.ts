import { Module } from '@nestjs/common';
import { FlightReservationsService } from '../../application/services/flight-reservations/flight-reservations.service';
import { FlightReservationsController } from '../../presentation/controllers/flight-reservations.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule.register()],
  providers: [FlightReservationsService],
  exports: [FlightReservationsService],
  controllers: [FlightReservationsController],
})
export class FlightReservationsModule {}
