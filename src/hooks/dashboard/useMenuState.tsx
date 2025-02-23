import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { MenuItem } from "@/types/staff";

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Burger",
    price: 14.99,
    category: "main",
    description: "Angus beef patty with lettuce, tomato, and special sauce",
    available: true,
    allergens: ["dairy", "gluten"],
    preparationTime: 15,
    image: "/placeholder.svg",
    orderCount: 150
  },
  {
    id: 2,
    name: "Caesar Salad",
    price: 10.99,
    category: "appetizer",
    description: "Crisp romaine, parmesan, croutons, and caesar dressing",
    available: true,
    allergens: ["dairy", "gluten"],
    preparationTime: 10,
    image: "/placeholder.svg",
    orderCount: 85
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    price: 8.99,
    category: "dessert",
    description: "Warm chocolate cake with molten center",
    available: true,
    allergens: ["dairy", "eggs", "gluten"],
    preparationTime: 20,
    image: "/placeholder.svg",
    orderCount: 95
  },
  {
    id: 4,
    name: "House Wine",
    price: 7.99,
    category: "beverage",
    description: "Glass of house red or white wine",
    available: true,
    allergens: ["sulfites"],
    preparationTime: 2,
    image: "/placeholder.svg",
    orderCount: 200
  }
];

export const useMenuState = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      id: menuItems.length + 1,
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
