
import { useState, useEffect } from "react";
import { KitchenLayout } from "./KitchenLayout";
import { EquipmentMonitor } from "./EquipmentMonitor";
import { KitchenOrderCard } from "./KitchenOrderCard";
import { QualityControl } from "./QualityControl";
import { TemperatureMonitor } from "./TemperatureMonitor";
import { InventoryTracker } from "./InventoryTracker";
import { useKitchenState } from "@/hooks/dashboard/useKitchenState";

export function KitchenDashboard() {
  const { 
    kitchenOrders,
    updateKitchenOrderStatus,
    updateOrderPriority,
    updateItemStatus 
  } = useKitchenState();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-6">
      {/* Orders Section - 8 columns on xl screens */}
      <div className="xl:col-span-8 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Active Orders</h2>
        <div className="grid gap-4">
          {kitchenOrders?.filter(order => order.status !== 'delivered').map(order => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              onUpdateStatus={updateKitchenOrderStatus}
              onUpdatePriority={updateOrderPriority}
              onUpdateItemStatus={updateItemStatus}
            />
          ))}
        </div>
      </div>

      {/* Kitchen Layout & Equipment - 4 columns on xl screens */}
      <div className="xl:col-span-4 space-y-6">
        <KitchenLayout activeOrders={kitchenOrders?.filter(order => order.status === 'preparing')} />
        <EquipmentMonitor />
        <QualityControl />
        {kitchenOrders?.map(order => (
          <InventoryTracker key={order.id} order={order} />
        ))}
        <TemperatureMonitor stationId="main-kitchen" />
      </div>
    </div>
  );
}
