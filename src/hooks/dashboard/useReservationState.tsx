
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Reservation } from "@/types/staff";

export const useReservationState = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const addReservation = (reservation: Omit<Reservation, "id">) => {
    const newReservation: Reservation = {
      id: reservations.length + 1,
      ...reservation,
    };
    setReservations([...reservations, newReservation]);
    toast({
      title: "Reservation confirmed",
      description: `Reservation for ${reservation.customerName} has been confirmed.`,
    });
  };

  const updateReservationStatus = (reservationId: number, status: Reservation["status"]) => {
    setReservations(reservations.map(reservation =>
      reservation.id === reservationId ? { ...reservation, status } : reservation
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
