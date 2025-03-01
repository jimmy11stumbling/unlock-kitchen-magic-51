
import { useKitchenOrders } from "./kitchen/useKitchenOrders";
import { useKitchenOrderStatus } from "./kitchen/useKitchenOrderStatus";
import { useKitchenItemStatus } from "./kitchen/useKitchenItemStatus";
import { useKitchenOrderCreation } from "./kitchen/useKitchenOrderCreation";

export const useKitchenState = () => {
  const { kitchenOrders, isLoading } = useKitchenOrders();
  const { updateKitchenOrderStatus, updateOrderPriority } = useKitchenOrderStatus();
  const { updateItemStatus } = useKitchenItemStatus();
  const { createKitchenOrder } = useKitchenOrderCreation();

  return {
    kitchenOrders,
    isLoading,
    updateKitchenOrderStatus,
    updateOrderPriority,
    updateItemStatus,
    createKitchenOrder
  };
};
