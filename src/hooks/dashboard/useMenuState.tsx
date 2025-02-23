
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { MenuItem } from "@/types/staff";

export const useMenuState = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      id: menuItems.length + 1,  // In a real app, this would be handled by the backend
      ...item,
    };
    setMenuItems([...menuItems, newItem]);
  };

  const updateMenuItemAvailability = (itemId: number, available: boolean) => {
    setMenuItems(menuItems.map(item =>
      item.id === itemId ? { ...item, available } : item
    ));
  };

  const updateMenuItemPrice = (itemId: number, price: number) => {
    setMenuItems(menuItems.map(item =>
      item.id === itemId ? { ...item, price } : item
    ));
  };

  const deleteMenuItem = (itemId: number) => {
    setMenuItems(menuItems.filter(item => item.id !== itemId));
  };

  const updateMenuItem = (itemId: number, updatedFields: Partial<MenuItem>) => {
    setMenuItems(menuItems.map(item =>
      item.id === itemId ? { ...item, ...updatedFields } : item
    ));
  };

  return {
    menuItems,
    addMenuItem,
    updateMenuItemAvailability,
    updateMenuItemPrice,
    deleteMenuItem,
    updateMenuItem,
  };
};
