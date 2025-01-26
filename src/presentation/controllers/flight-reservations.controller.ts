import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { FlightReservationsService } from '../../application/services/flight-reservations/flight-reservations.service';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { FlightReservation } from '../../domain/entities/flight-reservation.entity';
import { UserRole } from '../../domain/entities/user.entity';
import {
  UserRoles,
  GetUserRole,
} from '../../infrastructure/auth/decorators/roles.decorator';
import { PaginatedResponseDto } from '../dtos/pagination/pagination.dto';
import { FlightReservationsQueryDto } from '../dtos/flight-reservations/flight-reservations-query.dto';

@Controller('flight-reservations')
@UseGuards(JwtAuthGuard)
export class FlightReservationsController {
  constructor(
    private readonly flightReservationsService: FlightReservationsService,
  ) {}

  @Get()
  @UserRoles(UserRole.ADMIN, UserRole.STAFF)
  async findAll(
    @Query() queryParams: FlightReservationsQueryDto,
    @GetUserRole() userRole: UserRole,
  ): Promise<
    PaginatedResponseDto<FlightReservation | Partial<FlightReservation>>
  > {
    return this.flightReservationsService.findAll(userRole, queryParams);
  }

  @Get(':id')
  @UserRoles(UserRole.ADMIN, UserRole.STAFF)
  async findOne(
    @Param('id') id: string,
    @GetUserRole() userRole: UserRole,
  ): Promise<FlightReservation | Partial<FlightReservation> | null> {
    const reservation = await this.flightReservationsService.findById(
      id,
      userRole,
    );
    if (!reservation) {
      throw new NotFoundException(`Flight reservation with ID ${id} not found`);
    }
    return reservation;
  }
}
