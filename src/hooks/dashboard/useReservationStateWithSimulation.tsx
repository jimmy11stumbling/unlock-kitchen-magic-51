
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Reservation, ReservationStatus } from "@/types/reservations";
import { useSimulationData } from "@/hooks/useSimulationData";

export const useReservationStateWithSimulation = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInitialized, getData } = useSimulationData();

  // Load simulation data when component mounts
  useEffect(() => {
    if (isInitialized) {
      const data = getData();
      if (data && data.reservations) {
        setReservations(data.reservations);
      }
    }
    setLoading(false);
  }, [isInitialized, getData]);

  const addReservation = (reservation: Omit<Reservation, "id" | "createdAt">) => {
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
    
    // Update simulation data in storage
    if (isInitialized) {
      const data = getData();
      if (data) {
        data.reservations = [...reservations, newReservation];
        localStorage.setItem('simulationData', JSON.stringify(data));
      }
    }
    
    return newReservation;
  };

  const updateReservationStatus = (reservationId: number, status: ReservationStatus) => {
    const updatedReservations = reservations.map(reservation =>
      reservation.id === reservationId 
        ? { ...reservation, status, updatedAt: new Date().toISOString() } 
        : reservation
    );
    
    setReservations(updatedReservations);
    
    toast({
      title: "Reservation updated",
      description: `Reservation status has been updated to ${status}.`,
    });
    
    // Update simulation data in storage
    if (isInitialized) {
      const data = getData();
      if (data) {
        data.reservations = updatedReservations;
        localStorage.setItem('simulationData', JSON.stringify(data));
      }
    }
  };

  const getReservationsByDate = (date: string) => {
    return reservations.filter(reservation => reservation.date === date);
  };

  const getReservationsByStatus = (status: ReservationStatus) => {
    return reservations.filter(reservation => reservation.status === status);
  };

  const getTodaysReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    return getReservationsByDate(today);
  };

  const getUpcomingReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    return reservations.filter(
      reservation => reservation.date >= today && 
      ['pending', 'confirmed'].includes(reservation.status)
    );
  };

  return {
    reservations,
    loading,
    addReservation,
    updateReservationStatus,
    getReservationsByDate,
    getReservationsByStatus,
    getTodaysReservations,
    getUpcomingReservations,
  };
};
