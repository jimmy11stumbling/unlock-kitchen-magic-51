
import { useInventoryData } from "./useInventoryData";

export const useInventory = () => {
  const { inventoryItems: inventory, isLoading, updateQuantity, addItem } = useInventoryData(true);

  return {
    inventory,
    isLoading,
    updateQuantity,
    addItem
  };
};
