
import React from 'react';
import { ReservationsPanel } from '@/components/dashboard/ReservationsPanel';
import { useReservationState } from '@/hooks/dashboard/useReservationState';

const Reservations = () => {
  const { reservations, addReservation, updateReservationStatus } = useReservationState();

  return (
    <div className="container mx-auto p-4">
      <ReservationsPanel
        reservations={reservations}
        onAddReservation={addReservation}
        onUpdateStatus={updateReservationStatus}
      />
    </div>
  );
};

export default Reservations;
