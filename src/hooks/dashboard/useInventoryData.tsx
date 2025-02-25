
import { useState } from "react";
import type { InventoryItem } from "@/types";

export const useInventoryData = (initialize: boolean = false) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateQuantity = (itemId: number, newQuantity: number) => {
    setInventoryItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const addItem = (item: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = {
      ...item,
      id: Math.max(0, ...inventoryItems.map(i => i.id)) + 1,
      current_stock: item.quantity,
      reorder_point: item.minQuantity
    };
    setInventoryItems(prev => [...prev, newItem]);
  };

  return {
    inventoryItems,
    isLoading,
    updateQuantity,
    addItem
  };
};
