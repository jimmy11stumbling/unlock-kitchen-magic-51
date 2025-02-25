import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import type { InventoryItem } from '@/types';

export const useInventoryState = () => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const addInventoryItem = (item: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = {
      id: inventory.length + 1,
      ...item,
    };
    setInventory([...inventory, newItem]);
    toast({
      title: "Inventory updated",
      description: `${item.name} has been added to inventory.`,
    });
  };

  const updateInventoryQuantity = (itemId: number, quantity: number) => {
    if (quantity < 0) {
      toast({
        title: "Error",
        description: "Quantity cannot be negative.",
        variant: "destructive",
      });
      return;
    }

    setInventory(inventory.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, quantity };
        if (updatedItem.quantity <= updatedItem.minQuantity) {
          toast({
            title: "Low stock alert",
            description: `${item.name} is running low on stock.`,
            variant: "destructive",
          });
        }
        return updatedItem;
      }
      return item;
    }));
  };

  return {
    inventory,
    addInventoryItem,
    updateInventoryQuantity,
  };
};
