
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'seated' | 'completed' | 'no-show';

export interface Reservation {
  id: number;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  partySize: number;
  date: string;
  time: string;
  tableNumber?: number;
  status: ReservationStatus;
  notes?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt?: string;
}
