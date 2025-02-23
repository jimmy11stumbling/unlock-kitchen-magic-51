
import { Card } from "@/components/ui/card";
import { useState } from "react";
import type { Order, KitchenOrder } from "@/types/staff";
import { OrderList } from "./orders/OrderList";

interface OrdersPanelProps {
  orders: Order[];
  kitchenOrders: KitchenOrder[];
  onUpdateOrderStatus: (orderId: number, status: Order["status"]) => Promise<void>;
  onUpdateKitchenOrderStatus: (orderId: number, itemId: number, status: KitchenOrder["items"][0]["status"]) => Promise<void>;
  isHistoryView?: boolean;
}

export const OrdersPanel = ({ 
  orders, 
  kitchenOrders,
  onUpdateOrderStatus,
  onUpdateKitchenOrderStatus,
  isHistoryView = false 
}: OrdersPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  const filteredOrders = orders
    .filter(order => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      
      const searchTerm = searchQuery.toLowerCase();
      const orderItems = order.items.map(item => item.name.toLowerCase()).join(" ");
      return (
        order.id.toString().includes(searchTerm) ||
        order.tableNumber.toString().includes(searchTerm) ||
        orderItems.includes(searchTerm)
      );
    });

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <OrderList
          orders={filteredOrders}
          kitchenOrders={kitchenOrders}
          onUpdateOrderStatus={onUpdateOrderStatus}
          onUpdateKitchenOrderStatus={onUpdateKitchenOrderStatus}
          isHistoryView={isHistoryView}
        />
      </div>
    </Card>
  );
};
