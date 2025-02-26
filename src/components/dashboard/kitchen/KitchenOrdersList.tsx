
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";
import { KitchenOrderCard } from "./KitchenOrderCard";

interface KitchenOrdersListProps {
  orders: KitchenOrder[];
  onUpdateStatus: (orderId: number, status: KitchenOrder["status"]) => void;
  onUpdatePriority: (orderId: number, priority: KitchenOrder["priority"]) => void;
  onUpdateItemStatus: (
    orderId: number,
    itemId: number,
    status: KitchenOrderItem["status"],
    assignedChef?: string
  ) => void;
}

export const KitchenOrdersList = ({
  orders,
  onUpdateStatus,
  onUpdatePriority,
  onUpdateItemStatus
}: KitchenOrdersListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <KitchenOrderCard
          key={order.id}
          order={order}
          onUpdateStatus={onUpdateStatus}
          onUpdatePriority={onUpdatePriority}
          onUpdateItemStatus={onUpdateItemStatus}
        />
      ))}
      {orders.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No orders found
        </div>
      )}
    </div>
  );
};
