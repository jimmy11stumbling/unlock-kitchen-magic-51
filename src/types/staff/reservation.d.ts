
export type ReservationStatus = 
  | "pending"
  | "confirmed"
  | "seated"
  | "completed"
  | "cancelled"
  | "no-show";

export interface Reservation {
  id: number;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  tableNumber: number;
  status: ReservationStatus;
  notes: string;
  phoneNumber?: string;
  email?: string;
  specialRequests?: string;
  assignedServer?: number;
  createdAt: string;
  updatedAt: string;
}
