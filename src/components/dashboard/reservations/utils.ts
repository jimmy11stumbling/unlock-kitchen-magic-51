
import type { Reservation } from "@/types/staff";

export const getStatusColor = (status: Reservation["status"]): string => {
  switch (status) {
    case "confirmed":
      return "text-green-600 bg-green-100";
    case "pending":
      return "text-yellow-600 bg-yellow-100";
    case "cancelled":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const isTimeSlotAvailable = (
  time: string,
  date: string,
  tableNumber: number,
  reservations: Reservation[]
): boolean => {
  return !reservations.some(
    (r) =>
      r.date === date &&
      r.time === time &&
      r.tableNumber === tableNumber &&
      r.status !== "cancelled"
  );
};
