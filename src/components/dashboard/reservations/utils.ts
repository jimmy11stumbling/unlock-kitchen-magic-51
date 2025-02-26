
import type { Reservation, ReservationStatus } from "@/types/staff";

export const getStatusColor = (status: ReservationStatus) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "seated":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-purple-100 text-purple-800";
    case "no-show":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const isTimeSlotAvailable = (
  time: string,
  date: string,
  tableNumber: number,
  reservations: Reservation[]
) => {
  return !reservations.some(
    (reservation) =>
      reservation.date === date &&
      reservation.time === time &&
      reservation.tableNumber === tableNumber &&
      ["confirmed", "seated", "pending"].includes(reservation.status)
  );
};

export const validateTableCapacity = (
  partySize: number,
  tableNumber: number,
  tables: Array<{ number: number; capacity: number }>
) => {
  const table = tables.find(t => t.number === tableNumber);
  if (!table) return false;
  return partySize <= table.capacity;
};

export const getNextAllowedStatuses = (currentStatus: ReservationStatus): ReservationStatus[] => {
  switch (currentStatus) {
    case "pending":
      return ["confirmed", "cancelled"];
    case "confirmed":
      return ["seated", "cancelled", "no-show"];
    case "seated":
      return ["completed", "cancelled"];
    default:
      return [];
  }
};
