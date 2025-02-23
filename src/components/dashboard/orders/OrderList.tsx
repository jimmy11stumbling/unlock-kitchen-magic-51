
import type { Order } from "@/types/staff";
import { OrderItem } from "./OrderItem";

interface OrderListProps {
  orders: Order[];
  updateOrderStatus: (orderId: number, status: Order["status"]) => void;
}

export const OrderList = ({ orders, updateOrderStatus }: OrderListProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No orders found matching your filters
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderItem
          key={order.id}
          order={order}
          updateOrderStatus={updateOrderStatus}
        />
      ))}
    </div>
  );
};
