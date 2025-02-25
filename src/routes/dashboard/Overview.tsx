import { AlertsPanel } from "@/components/dashboard/overview/AlertsPanel";
import { useEffect, useState } from "react";
import { useInventory } from "@/hooks/dashboard/useInventory";
import { useReservations } from "@/hooks/dashboard/useReservations";
import { useOrders } from "@/hooks/dashboard/useOrders";
import type { InventoryItem, Reservation, Order } from "@/types";

export const Overview = () => {
  const { inventory } = useInventory();
  const { reservations } = useReservations();
  const { orders } = useOrders();
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    // Filter low stock items
    const lowStock = inventory.filter(item => 
      item.quantity <= item.minQuantity
    );
    setLowStockItems(lowStock);

    // Filter pending reservations
    const pending = reservations.filter(res => 
      res.status === "pending"
    );
    setPendingReservations(pending);
  }, [inventory, reservations]);

  return (
    <div className="p-6 space-y-6">
      <AlertsPanel
        inventory={inventory}
        reservations={reservations}
        orders={orders}
        lowStockItems={lowStockItems}
        pendingReservations={pendingReservations}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Additional dashboard widgets can be added here */}
      </div>
    </div>
  );
};
