
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'seated' | 'completed' | 'no-show';

export interface Reservation {
  id: number;
  date: string;
  time: string;
  partySize: number;
  customerName: string;
  phoneNumber?: string; // Making this optional since it's not always provided
  email?: string;
  status: ReservationStatus;
  tableAssigned?: number;
  tableNumber?: number; // Add this field
  specialRequests?: string;
  notes?: string;
  createdAt?: string;
}
