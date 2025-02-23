
import { useOrders } from "./orders/useOrders";
import { useKitchenOrders } from "./orders/useKitchenOrders";
import { useOrderActions } from "./orders/useOrderActions";

export const useOrderState = () => {
  const { orders, isLoading: ordersLoading } = useOrders();
  const { kitchenOrders, isLoading: kitchenOrdersLoading } = useKitchenOrders();
  const { addOrder, updateOrderStatus, updateKitchenOrderStatus } = useOrderActions(kitchenOrders);

  return {
    orders,
    kitchenOrders,
    isLoading: ordersLoading || kitchenOrdersLoading,
    addOrder,
    updateOrderStatus,
    updateKitchenOrderStatus,
  };
};
