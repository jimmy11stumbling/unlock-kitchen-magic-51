
import type { Reservation } from "@/types/staff";

export const getStatusColor = (status: Reservation["status"]) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
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
      reservation.status !== "cancelled"
  );
};
