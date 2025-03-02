
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'seated' | 'completed' | 'no-show';

export interface Reservation {
  id: number;
  date: string;
  time: string;
  partySize: number;
  customerName: string;
  phoneNumber: string;
  email?: string;
  status: ReservationStatus;
  tableAssigned?: number;
  specialRequests?: string;
  createdAt?: string;
}
