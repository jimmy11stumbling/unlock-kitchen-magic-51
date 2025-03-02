
import type { ReservationStatus } from "@/types/staff";

// Get status color for display
export const getStatusColor = (status: ReservationStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'seated':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-gray-100 text-gray-800';
    case 'no-show':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Format time to more readable format
export const formatTime = (time: string): string => {
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch (error) {
    return time;
  }
};

// Get next allowed statuses based on current status
export const getNextAllowedStatuses = (currentStatus: ReservationStatus): ReservationStatus[] => {
  switch (currentStatus) {
    case 'pending':
      return ['confirmed', 'cancelled'];
    case 'confirmed':
      return ['seated', 'cancelled', 'no-show'];
    case 'seated':
      return ['completed'];
    case 'completed':
      return [];
    case 'cancelled':
      return ['pending']; // Allow reactivation
    case 'no-show':
      return ['pending']; // Allow rebooking
    default:
      return [];
  }
};

// Get all statuses
export const getAllStatuses = (): ReservationStatus[] => {
  return ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show'];
};
