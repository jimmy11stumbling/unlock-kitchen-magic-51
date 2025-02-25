
import { useState } from "react";
import type { Order } from "@/types";

export const useOrders = () => {
  const [orders] = useState<Order[]>([]);

  return {
    orders,
    isLoading: false
  };
};
