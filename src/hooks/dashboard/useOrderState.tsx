
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
    try {
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

      setOrders(prevOrders => [...prevOrders, newOrder]);
      setKitchenOrders(prevKitchenOrders => [...prevKitchenOrders, newKitchenOrder]);

      toast({
        title: "New order created",
        description: `Order #${newOrder.id} has been sent to kitchen`,
        variant: "default"
      });

      return newOrder;
    } catch (error) {
      console.error("Error adding order:", error);
      toast({
        title: "Error creating order",
        description: "Something went wrong while creating the order",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateOrderStatus = (orderId: number, status: Order["status"]) => {
    try {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );

      // Update kitchen order status if needed
      if (status === "delivered") {
        setKitchenOrders(prevKitchenOrders =>
          prevKitchenOrders.map(order =>
            order.orderId === orderId
              ? {
                  ...order,
                  items: order.items.map(item => ({
                    ...item,
                    status: "delivered",
                    completionTime: new Date().toISOString()
                  }))
                }
              : order
          )
        );
      }

      toast({
        title: "Order Updated",
        description: `Order #${orderId} status changed to ${status}`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error updating order",
        description: "Something went wrong while updating the order status",
        variant: "destructive"
      });
    }
  };

  const updateKitchenOrderStatus = (
    orderId: number,
    itemId: number,
    status: KitchenOrder["items"][0]["status"]
  ) => {
    try {
      setKitchenOrders(prevKitchenOrders =>
        prevKitchenOrders.map((order) =>
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
        title: "Item Status Updated",
        description: `Item status updated to ${status}`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating kitchen order status:", error);
      toast({
        title: "Error updating item",
        description: "Something went wrong while updating the item status",
        variant: "destructive"
      });
    }
  };

  const deleteOrder = (orderId: number) => {
    try {
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      setKitchenOrders(prevKitchenOrders => 
        prevKitchenOrders.filter(order => order.orderId !== orderId)
      );

      toast({
        title: "Order Deleted",
        description: `Order #${orderId} has been deleted`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Error deleting order",
        description: "Something went wrong while deleting the order",
        variant: "destructive"
      });
    }
  };

  return {
    orders,
    kitchenOrders,
    addOrder,
    updateOrderStatus,
    updateKitchenOrderStatus,
    deleteOrder,
  };
};
