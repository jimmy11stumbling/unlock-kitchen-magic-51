import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useKitchenOrders } from "@/hooks/dashboard/kitchen/useKitchenOrders";
import { useKitchenOrderStatus } from "@/hooks/dashboard/kitchen/useKitchenOrderStatus";
import { useKitchenOrderCreation } from "@/hooks/dashboard/kitchen/useKitchenOrderCreation";
import { KitchenOrderCard } from "./KitchenOrderCard";
import type { KitchenOrder } from "@/types/staff";

export function KitchenDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<KitchenOrder["status"]>("pending");
  const { kitchenOrders, isLoading } = useKitchenOrders();
  const { updateKitchenOrderStatus } = useKitchenOrderStatus();
  const { createKitchenOrder } = useKitchenOrderCreation();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) {
      toast({
        title: "Loading",
        description: "Fetching kitchen orders...",
      });
    }
  }, [isLoading, toast]);

  const handleUpdateStatus = (orderId: number, status: KitchenOrder["status"]) => {
    updateKitchenOrderStatus(orderId, status);
  };

  const filteredOrders = kitchenOrders.filter((order) => {
    const searchMatch =
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || String(order.order_id).includes(searchTerm);

    const statusMatch = statusFilter === "all" || order.status === statusFilter;

    return searchMatch && statusMatch;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          type="search"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <Button
            variant={statusFilter === "pending" ? "default" : "outline"}
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === "preparing" ? "default" : "outline"}
            onClick={() => setStatusFilter("preparing")}
          >
            Preparing
          </Button>
          <Button
            variant={statusFilter === "ready" ? "default" : "outline"}
            onClick={() => setStatusFilter("ready")}
          >
            Ready
          </Button>
          <Button
            variant={statusFilter === "delivered" ? "default" : "outline"}
            onClick={() => setStatusFilter("delivered")}
          >
            Delivered
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <KitchenOrderCard
            key={order.id}
            order={order}
            onUpdateStatus={(orderId, status) => handleUpdateStatus(orderId, status)}
            onUpdatePriority={(orderId, priority) => console.log("Update priority", orderId, priority)}
            onUpdateItemStatus={(orderId, itemId, status, assignedChef) => 
              console.log("Update item status", orderId, itemId, status, assignedChef)
            }
          />
        ))}
      </div>
    </div>
  );
}
