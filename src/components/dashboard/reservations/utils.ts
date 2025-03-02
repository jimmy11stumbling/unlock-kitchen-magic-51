
import { ReservationStatus } from "@/types/staff";

// Define the state machine for reservation status transitions
const statusTransitions: Record<ReservationStatus, ReservationStatus[]> = {
  'pending': ['confirmed', 'cancelled'],
  'confirmed': ['seated', 'cancelled', 'no-show'],
  'seated': ['completed', 'cancelled'],
  'completed': [],
  'cancelled': ['pending'],
  'no-show': ['pending']
};

/**
 * Get the next allowed statuses for a reservation based on its current status
 * @param currentStatus The current status of the reservation
 * @returns Array of allowed next statuses
 */
export const getNextAllowedStatuses = (currentStatus: ReservationStatus): ReservationStatus[] => {
  return statusTransitions[currentStatus] || [];
};

/**
 * Get the color for a reservation status
 * @param status The reservation status
 * @returns The color class for the status
 */
export const getStatusColor = (status: ReservationStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'seated':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'no-show':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Format a reservation for display
 * @param reservation The reservation to format
 * @returns Formatted reservation string
 */
export const formatReservation = (
  customerName: string,
  date: string,
  time: string,
  partySize: number
): string => {
  const formattedDate = new Date(date).toLocaleDateString();
  return `${customerName} - ${formattedDate} at ${time} - Party of ${partySize}`;
};
