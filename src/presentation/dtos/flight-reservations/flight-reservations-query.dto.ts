import { IsOptional, IsDateString } from 'class-validator';
import { PaginationParamsDto } from '../pagination/pagination.dto';

export class FlightReservationsQueryDto extends PaginationParamsDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
