import { useState, useEffect } from "react";
import { useSimulationData } from "@/hooks/useSimulationData";
import type { Reservation, ReservationStatus } from "@/types/staff";

export const useReservationStateWithSimulation = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { isInitialized, getData } = useSimulationData();

  useEffect(() => {
    if (isInitialized) {
      const simData = getData();
      const initialReservations = (simData && simData.reservations) ? simData.reservations : [];
      setReservations(initialReservations);
    }
  }, [isInitialized, getData]);

  const addReservation = (reservation: Omit<Reservation, "id">) => {
    if (isInitialized) {
      const simData = getData();
      if (simData && simData.reservations) {
        const updatedReservations = [...simData.reservations];
        const newReservation: Reservation = {
          ...reservation,
          id: updatedReservations.length + 1,
          createdAt: new Date().toISOString(),
        };
        updatedReservations.push(newReservation);
        setReservations(updatedReservations);
      }
    }
  };

  const updateReservationStatus = (reservationId: number, status: ReservationStatus) => {
    if (isInitialized) {
      const simData = getData();
      if (simData && simData.reservations) {
        const updatedReservations = simData.reservations.map(res =>
          res.id === reservationId ? { ...res, status } : res
        );
        setReservations(updatedReservations);
      }
    }
  };

  return {
    reservations,
    addReservation,
    updateReservationStatus,
  };
};
