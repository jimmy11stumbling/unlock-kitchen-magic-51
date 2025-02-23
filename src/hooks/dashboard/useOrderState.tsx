
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Order, KitchenOrder } from "@/types/staff";
import { menuItems } from "@/data/menuItems";
import { initialOrders, initialKitchenOrders } from "@/data/initialOrders";
import { 
  determineStation, 
  assignChef, 
  calculateEstimatedPrepTime,
  checkAllergenConflicts,
  optimizeCourseOrder,
  validateOrderCompletion
} from "@/utils/kitchenUtils";

export const useOrderState = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>(initialKitchenOrders);

  const determinePriority = (order: Omit<Order, "id" | "timestamp">): KitchenOrder["priority"] => {
    if (order.specialInstructions?.toLowerCase().includes("vip")) return "rush";
    if (order.items.length > 4) return "high";
    return "normal";
  };

  const addOrder = (order: Omit<Order, "id" | "timestamp">) => {
    const newOrder: Order = {
      id: orders.length + 1,
      timestamp: new Date().toISOString(),
      ...order,
    };
    
    const estimatedPrepTime = calculateEstimatedPrepTime(order.items, menuItems);
    const coursing = optimizeCourseOrder(order.items, menuItems);
    
    // Extract allergies from special instructions
    const allergyMatch = order.specialInstructions?.match(/allergy[:\s]+(\w+)/i);
    const customerAllergies = allergyMatch ? [allergyMatch[1].toLowerCase()] : [];
    
    const newKitchenOrder: KitchenOrder = {
      id: kitchenOrders.length + 1,
      orderId: newOrder.id,
      items: order.items.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        status: "pending",
        startTime: new Date().toISOString(),
        cookingStation: determineStation(item.id),
        assignedChef: assignChef(item.id),
        modifications: [],
        allergenAlert: checkAllergenConflicts(item.id, customerAllergies, menuItems)
      })),
      priority: determinePriority(order),
      notes: order.specialInstructions || "",
      coursing,
      estimatedDeliveryTime: new Date(Date.now() + estimatedPrepTime * 60000).toISOString()
    };

    setOrders([...orders, newOrder]);
    setKitchenOrders([...kitchenOrders, newKitchenOrder]);

    toast({
      title: "New order created",
      description: `Order #${newOrder.id} has been sent to kitchen`,
    });
  };

  const updateOrderStatus = (orderId: number, status: Order["status"]) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));

    if (status === "ready") {
      toast({
        title: "Order Ready",
        description: `Order #${orderId} is ready for service`,
      });
    }
  };

  const updateKitchenOrderStatus = (
    orderId: number,
    itemId: number,
    status: KitchenOrder["items"][0]["status"]
  ) => {
    setKitchenOrders(
      kitchenOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.menuItemId === itemId
                  ? {
                      ...item,
                      status,
                      startTime: status === "preparing" ? new Date().toISOString() : item.startTime,
                      completionTime:
                        status === "ready" ? new Date().toISOString() : item.completionTime,
                    }
                  : item
              ),
            }
          : order
      )
    );

    const updatedOrder = kitchenOrders.find(o => o.id === orderId);
    if (updatedOrder && validateOrderCompletion(updatedOrder.items)) {
      updateOrderStatus(updatedOrder.orderId, "ready");
    }

    toast({
      title: "Item status updated",
      description: `Item status updated to ${status}`,
      variant: "default"
    });
  };

  return {
    orders,
    kitchenOrders,
    addOrder,
    updateOrderStatus,
    updateKitchenOrderStatus,
  };
};
