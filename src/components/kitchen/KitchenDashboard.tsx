
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { KitchenOrderCard } from "./KitchenOrderCard";
import { useKitchenState } from "@/hooks/dashboard/useKitchenState";
import type { KitchenOrder } from "@/types/staff";

export const KitchenDashboard = () => {
  const { kitchenOrders, isLoading, updateKitchenOrderStatus } = useKitchenState();
  const [filterStatus, setFilterStatus] = useState<KitchenOrder["status"] | "all">("all");

  const filteredOrders = kitchenOrders.filter(order => 
    filterStatus === "all" || order.status === filterStatus
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredOrders.map(order => (
        <KitchenOrderCard
          key={order.id}
          order={order}
          onStatusUpdate={updateKitchenOrderStatus}
          onFlag={() => {}} // Implement flag functionality if needed
        />
      ))}
    </div>
  );
};
