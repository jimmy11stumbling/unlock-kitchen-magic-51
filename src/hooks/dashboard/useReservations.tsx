
import { useState } from "react";
import type { Reservation } from "@/types";

export const useReservations = () => {
  const [reservations] = useState<Reservation[]>([]);

  return {
    reservations,
    isLoading: false
  };
};
