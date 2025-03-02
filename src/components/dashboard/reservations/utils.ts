
import type { Reservation, ReservationStatus } from "@/types/staff";

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

export const getStatusOptions = (): { value: ReservationStatus; label: string }[] => [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'seated', label: 'Seated' },
  { value: 'completed', label: 'Completed' },
  { value: 'no-show', label: 'No-Show' }
];

export const getFilteredReservations = (
  reservations: Reservation[],
  selectedDate: Date | null,
  statusFilter: ReservationStatus | 'all',
  searchTerm: string
): Reservation[] => {
  return reservations.filter(reservation => {
    // Filter by date if selected
    if (selectedDate) {
      const reservationDate = new Date(reservation.date);
      if (
        reservationDate.getDate() !== selectedDate.getDate() ||
        reservationDate.getMonth() !== selectedDate.getMonth() ||
        reservationDate.getFullYear() !== selectedDate.getFullYear()
      ) {
        return false;
      }
    }

    // Filter by status if not 'all'
    if (statusFilter !== 'all' && reservation.status !== statusFilter) {
      return false;
    }

    // Filter by search term
    if (searchTerm && !reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });
};

export const getFormattedTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  
  if (isNaN(hour)) return time;
  
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  
  return `${displayHour}:${minutes} ${suffix}`;
};
