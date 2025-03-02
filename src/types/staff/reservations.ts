
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'seated' | 'completed' | 'no-show';

export interface Reservation {
  id: number;
  date: string;
  time: string;
  partySize: number;
  customerName: string;
  customerPhone: string; // Make sure this matches with the main type
  email?: string;
  status: ReservationStatus;
  tableAssigned?: number;
  tableNumber?: number;
  specialRequests?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
