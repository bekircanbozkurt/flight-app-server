import { Inject, Injectable } from '@nestjs/common';
import { FlightReservation } from '../../../domain/entities/flight-reservation.entity';
import { UserRole } from '../../../domain/entities/user.entity';
import { PaginatedResponseDto } from '../../../presentation/dtos/pagination/pagination.dto';
import { DatabaseService } from '../../../infrastructure/database/database.interface';
import { FlightReservationsQueryDto } from '../../../presentation/dtos/flight-reservations/flight-reservations-query.dto';

type FlightReservationWithId = FlightReservation & { id: string };

@Injectable()
export class FlightReservationsService {
  private readonly collection = 'flightReservations';

  constructor(
    @Inject('DATABASE_SERVICE')
    private readonly databaseService: DatabaseService,
  ) {}

  private filterReservationForStaff(
    reservation: FlightReservationWithId,
  ): Partial<FlightReservationWithId> {
    return {
      id: reservation.id,
      bookingDate: reservation.bookingDate,
      bookingReference: reservation.bookingReference,
      createdAt: reservation.createdAt,
      currency: reservation.currency,
      flightDetails: reservation.flightDetails,
      reservationId: reservation.reservationId,
      status: reservation.status,
      totalPrice: reservation.totalPrice,
      updatedAt: reservation.updatedAt,
    };
  }

  private filterReservationsByDateRange(
    reservations: FlightReservationWithId[],
    startDate?: string,
    endDate?: string,
  ): FlightReservationWithId[] {
    if (!startDate && !endDate) {
      return reservations;
    }

    return reservations.filter((reservation) => {
      const bookingDate = new Date(reservation.bookingDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return bookingDate >= start && bookingDate <= end;
      } else if (start) {
        return bookingDate >= start;
      } else if (end) {
        return bookingDate <= end;
      }
      return true;
    });
  }

  async findAll(
    userRole: UserRole,
    queryParams: FlightReservationsQueryDto,
  ): Promise<
    PaginatedResponseDto<
      FlightReservationWithId | Partial<FlightReservationWithId>
    >
  > {
    const reservations =
      await this.databaseService.readCollection<FlightReservationWithId>(
        this.collection,
      );

    // Apply date filtering
    const filteredByDate = this.filterReservationsByDateRange(
      reservations,
      queryParams.startDate,
      queryParams.endDate,
    );

    // Sort by bookingDate in descending order
    const sortedReservations = [...filteredByDate].sort(
      (a, b) =>
        new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime(),
    );

    const results =
      userRole === UserRole.ADMIN
        ? sortedReservations
        : sortedReservations.map((reservation) =>
            this.filterReservationForStaff(reservation),
          );

    // Apply pagination
    const page = queryParams?.page || 1;
    const limit = queryParams?.limit || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / limit);

    const paginatedData = results.slice(startIndex, endIndex);
    return {
      data: paginatedData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findById(
    id: string,
    userRole: UserRole,
  ): Promise<
    FlightReservationWithId | Partial<FlightReservationWithId> | null
  > {
    const reservation =
      await this.databaseService.findOne<FlightReservationWithId>(
        this.collection,
        (reservation) => reservation.id === id,
      );

    if (!reservation) {
      return null;
    }

    if (userRole === UserRole.ADMIN) {
      return reservation;
    }

    return this.filterReservationForStaff(reservation);
  }
}
