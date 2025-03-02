
export interface TableLayout {
  id: number;
  number: number;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  section: "indoor" | "outdoor" | "bar";
  reservationId?: number;
  activeOrder: number | null;
}

export interface Reservation {
  id: number;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  tableNumber: number;
  status: "confirmed" | "pending" | "cancelled" | "seated" | "completed";
  notes?: string;
  phoneNumber?: string;
  createdAt?: string;
}

export type ReservationStatus = "confirmed" | "pending" | "cancelled" | "seated" | "completed";
