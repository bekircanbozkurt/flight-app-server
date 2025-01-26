export interface FlightReservation {
  id: string;
  reservationId: string;
  bookingReference: string;
  bookingDate: string;
  status: string;
  passengers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    passportNumber: string;
    nationality: string;
    seatNumber: string;
  }>;
  flightDetails: {
    flightNumber: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    aircraft: string;
  };
  suggestions: Array<{
    id: string;
    type: string;
    description: string;
    status: string;
  }>;
  comments: Array<{
    id: string;
    text: string;
    createdAt: string;
    createdBy: string;
    type: string;
  }>;
  totalPrice: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}
