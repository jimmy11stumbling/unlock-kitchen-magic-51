
import { Card } from "@/components/ui/card";
import { useState } from "react";
import type { Order } from "@/types/staff";
import { OrderHeader } from "./orders/OrderHeader";
import { OrderList } from "./orders/OrderList";

interface OrdersPanelProps {
  orders: Order[];
  updateOrderStatus: (orderId: number, status: Order["status"]) => void;
}

export const OrdersPanel = ({ orders, updateOrderStatus }: OrdersPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  const filteredOrders = orders
    .filter(order => {
      // Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      
      // Search filter
      const searchTerm = searchQuery.toLowerCase();
      const orderItems = order.items.map(item => item.name.toLowerCase()).join(" ");
      return (
        order.id.toString().includes(searchTerm) ||
        order.tableNumber.toString().includes(searchTerm) ||
        orderItems.includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      
      switch (sortBy) {
        case "newest":
          return timeB - timeA;
        case "oldest":
          return timeA - timeB;
        case "highest":
          return b.total - a.total;
        case "lowest":
          return a.total - b.total;
        default:
          return 0;
      }
    });

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <OrderHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <OrderList
          orders={filteredOrders}
          updateOrderStatus={updateOrderStatus}
        />
      </div>
    </Card>
  );
};
