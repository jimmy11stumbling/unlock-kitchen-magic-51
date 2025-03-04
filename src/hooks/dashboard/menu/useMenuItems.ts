
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { MenuItem } from "@/types/staff";

// Initial menu items data for fallback
const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Burger",
    price: 14.99,
    category: "main",
    description: "Angus beef patty with lettuce, tomato, and special sauce",
    available: true,
    allergens: ["gluten", "dairy"],
    preparationTime: 15,
    orderCount: 1250
  },
  {
    id: 2,
    name: "Caesar Salad",
    price: 10.99,
    category: "appetizer",
    description: "Crisp romaine lettuce, croutons, parmesan cheese",
    available: true,
    allergens: ["gluten", "dairy", "eggs"],
    preparationTime: 10,
    orderCount: 980
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    price: 8.99,
    category: "dessert",
    description: "Warm chocolate cake with molten center",
    available: true,
    allergens: ["gluten", "dairy", "eggs"],
    preparationTime: 20,
    orderCount: 750
  },
  {
    id: 4,
    name: "Margherita Pizza",
    price: 16.99,
    category: "main",
    description: "Fresh mozzarella, tomatoes, and basil",
    available: true,
    allergens: ["gluten", "dairy"],
    preparationTime: 20,
    orderCount: 1100
  },
  {
    id: 5,
    name: "Craft Beer",
    price: 8.99,
    category: "beverage",
    description: "Selection of local craft beers",
    available: true,
    allergens: ["gluten"],
    preparationTime: 2,
    orderCount: 2200
  },
  {
    id: 6,
    name: "Seafood Pasta",
    price: 22.99,
    category: "main",
    description: "Fresh seafood in white wine sauce",
    available: true,
    allergens: ["shellfish", "gluten"],
    preparationTime: 25,
    orderCount: 680
  },
  {
    id: 7,
    name: "Asian Stir-Fry",
    price: 18.99,
    category: "main",
    description: "Seasonal vegetables with choice of protein in house sauce",
    available: true,
    allergens: ["soy", "gluten"],
    preparationTime: 18,
    orderCount: 890
  },
  {
    id: 8,
    name: "Truffle Fries",
    price: 9.99,
    category: "appetizer",
    description: "Hand-cut fries with truffle oil and parmesan",
    available: true,
    allergens: ["dairy"],
    preparationTime: 12,
    orderCount: 1500
  },
  {
    id: 9,
    name: "Signature Cocktails",
    price: 12.99,
    category: "beverage",
    description: "Seasonal craft cocktails",
    available: true,
    allergens: [],
    preparationTime: 5,
    orderCount: 1800
  },
  {
    id: 10,
    name: "New York Cheesecake",
    price: 9.99,
    category: "dessert",
    description: "Classic cheesecake with berry compote",
    available: true,
    allergens: ["dairy", "eggs", "gluten"],
    preparationTime: 5,
    orderCount: 920
  }
];

/**
 * Hook for fetching menu items
 */
export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*');
      
      if (error) {
        console.log('Falling back to initial menu items');
        return initialMenuItems;
      }
      
      if (!data || data.length === 0) {
        console.log('No menu items found in database, using initial items');
        return initialMenuItems;
      }
      
      return data.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category as MenuItem["category"],
        description: item.description || "",
        available: item.available ?? true,
        image: item.image_url || "/placeholder.svg",
        allergens: item.allergens || [],
        preparationTime: item.preparation_time || 15,
        orderCount: item.order_count || 0
      }));
    }
  });
};

// Export the initial menu items for other hooks to use if needed
export { initialMenuItems };
