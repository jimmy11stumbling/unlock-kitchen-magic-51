
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { MenuItem } from "@/types/staff";

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Truffle Wagyu Burger",
    price: 24.99,
    category: "main",
    description: "Premium wagyu beef patty with truffle aioli, caramelized onions, and aged cheddar",
    available: true,
    allergens: ["dairy", "gluten", "eggs"],
    preparationTime: 20,
    image: "/placeholder.svg",
    orderCount: 342
  },
  {
    id: 2,
    name: "Mediterranean Quinoa Bowl",
    price: 18.99,
    category: "main",
    description: "Fresh quinoa with roasted vegetables, feta, and herb-lemon dressing",
    available: true,
    allergens: ["dairy"],
    preparationTime: 15,
    image: "/placeholder.svg",
    orderCount: 256
  },
  {
    id: 3,
    name: "Lobster Bisque",
    price: 16.99,
    category: "appetizer",
    description: "Creamy lobster soup with cognac and fresh herbs",
    available: true,
    allergens: ["shellfish", "dairy"],
    preparationTime: 12,
    image: "/placeholder.svg",
    orderCount: 189
  },
  {
    id: 4,
    name: "Tuna Tartare",
    price: 19.99,
    category: "appetizer",
    description: "Fresh tuna with avocado, sesame-soy dressing, and wonton crisps",
    available: true,
    allergens: ["fish", "soy"],
    preparationTime: 15,
    image: "/placeholder.svg",
    orderCount: 167
  },
  {
    id: 5,
    name: "Crème Brûlée",
    price: 12.99,
    category: "dessert",
    description: "Classic vanilla bean custard with caramelized sugar crust",
    available: true,
    allergens: ["dairy", "eggs"],
    preparationTime: 8,
    image: "/placeholder.svg",
    orderCount: 298
  },
  {
    id: 6,
    name: "Signature Martini",
    price: 15.99,
    category: "beverage",
    description: "House-infused gin with vermouth and olive tapenade",
    available: true,
    allergens: [],
    preparationTime: 5,
    image: "/placeholder.svg",
    orderCount: 423
  },
  {
    id: 7,
    name: "Seafood Paella",
    price: 34.99,
    category: "main",
    description: "Saffron rice with fresh seafood, chorizo, and seasonal vegetables",
    available: true,
    allergens: ["shellfish", "fish"],
    preparationTime: 30,
    image: "/placeholder.svg",
    orderCount: 178
  },
  {
    id: 8,
    name: "Chocolate Soufflé",
    price: 14.99,
    category: "dessert",
    description: "Warm chocolate soufflé with vanilla bean ice cream",
    available: true,
    allergens: ["dairy", "eggs", "gluten"],
    preparationTime: 20,
    image: "/placeholder.svg",
    orderCount: 245
  },
];

export const useMenuState = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      id: menuItems.length + 1,
      ...item,
      orderCount: 0,
    };
    setMenuItems([...menuItems, newItem]);
  };

  const updateMenuItemAvailability = (itemId: number, available: boolean) => {
    setMenuItems(menuItems.map(item =>
      item.id === itemId ? { ...item, available } : item
    ));
  };

  const updateMenuItemPrice = (itemId: number, price: number) => {
    if (price <= 0) return;
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
