
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Reservation, ReservationStatus } from "@/types/reservations";

export const useReservationState = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const addReservation = (reservation: Omit<Reservation, "id">) => {
    const newReservation: Reservation = {
      id: reservations.length + 1,
      ...reservation,
      createdAt: new Date().toISOString(),
    };
    setReservations([...reservations, newReservation]);
    toast({
      title: "Reservation confirmed",
      description: `Reservation for ${reservation.customerName} has been confirmed.`,
    });
  };

  const updateReservationStatus = (reservationId: number, status: ReservationStatus) => {
    setReservations(reservations.map(reservation =>
      reservation.id === reservationId 
        ? { ...reservation, status, updatedAt: new Date().toISOString() } 
        : reservation
    ));
    toast({
      title: "Reservation updated",
      description: `Reservation status has been updated to ${status}.`,
    });
  };

  return {
    reservations,
    addReservation,
    updateReservationStatus,
  };
};
