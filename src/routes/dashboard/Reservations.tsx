
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ReservationsPanel } from "@/components/dashboard/ReservationsPanel";
import { useReservationState } from "@/hooks/dashboard/useReservationState";
import type { Reservation, ReservationStatus } from "@/types/reservations";

const Reservations = () => {
  const { reservations, addReservation, updateReservationStatus } = useReservationState();
  const { toast } = useToast();

  const handleAddReservation = (reservation: Omit<Reservation, "id">) => {
    addReservation(reservation);
    toast({
      title: "Reservation Added",
      description: `Reservation for ${reservation.customerName} has been added.`
    });
  };

  const handleUpdateStatus = (reservationId: number, status: ReservationStatus) => {
    updateReservationStatus(reservationId, status);
    toast({
      title: "Reservation Updated",
      description: `Reservation status has been updated to ${status}.`
    });
  };

  // Make sure the ReservationsPanel accepts these props
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Reservations</h1>
      <ReservationsPanel 
        reservations={reservations}
        onAddReservation={handleAddReservation}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default Reservations;
