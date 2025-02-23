
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { OrderItem } from "./OrderItem";
import { OrderHeader } from "./OrderHeader";
import { OrderStatus } from "./OrderStatus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Order, KitchenOrder } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";

interface OrderListProps {
  orders: Order[];
  kitchenOrders: KitchenOrder[];
  onUpdateOrderStatus: (orderId: number, status: Order["status"]) => void;
  onUpdateKitchenOrderStatus: (orderId: number, itemId: number, status: KitchenOrder["items"][0]["status"]) => void;
  isHistoryView?: boolean;
}

export const OrderList = ({
  orders,
  kitchenOrders,
  onUpdateOrderStatus,
  onUpdateKitchenOrderStatus,
  isHistoryView = false
}: OrderListProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.serverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber.toString().includes(searchQuery);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: number, newStatus: Order["status"]) => {
    try {
      await onUpdateOrderStatus(orderId, newStatus);
      toast({
        title: "Order Updated",
        description: `Order #${orderId} status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleKitchenItemStatusChange = async (
    orderId: number,
    itemId: number,
    status: KitchenOrder["items"][0]["status"]
  ) => {
    try {
      await onUpdateKitchenOrderStatus(orderId, itemId, status);
      toast({
        title: "Item Status Updated",
        description: `Item status changed to ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by server or table number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <select
          className="border rounded-md px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Order["status"] | "all")}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredOrders.map((order) => {
          const kitchenOrder = kitchenOrders.find(ko => ko.orderId === order.id);
          
          return (
            <Card key={order.id} className="p-4">
              <OrderHeader orderData={order} />
              
              <div className="mt-4 space-y-4">
                {order.items.map((item) => (
                  <OrderItem
                    key={`${order.id}-${item.id}`}
                    orderItem={item}
                    kitchenStatus={
                      kitchenOrder?.items.find(ki => ki.menuItemId === item.id)?.status
                    }
                    onKitchenStatusChange={
                      (status) => handleKitchenItemStatusChange(order.id, item.id, status)
                    }
                    isHistoryView={isHistoryView}
                  />
                ))}
              </div>

              {!isHistoryView && (
                <div className="mt-4 flex justify-between items-center">
                  <OrderStatus status={order.status} />
                  <div className="space-x-2">
                    {order.status !== "delivered" && (
                      <>
                        {order.status === "pending" && (
                          <Button
                            onClick={() => handleStatusChange(order.id, "preparing")}
                          >
                            Start Preparing
                          </Button>
                        )}
                        {order.status === "preparing" && (
                          <Button
                            onClick={() => handleStatusChange(order.id, "ready")}
                          >
                            Mark Ready
                          </Button>
                        )}
                        {order.status === "ready" && (
                          <Button
                            onClick={() => handleStatusChange(order.id, "delivered")}
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
