
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { MenuItem } from "@/types/staff";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

export const useMenuState = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch menu items with fallback to initial items
  const { data: menuItems = initialMenuItems, isLoading, error } = useQuery({
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

  // Add menu item mutation
  const addMenuItemMutation = useMutation({
    mutationFn: async (item: Omit<MenuItem, "id">) => {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          name: item.name,
          price: item.price,
          category: item.category,
          description: item.description,
          available: item.available,
          image_url: item.image,
          allergens: item.allergens,
          preparation_time: item.preparationTime
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast({
        title: "Menu Item Added",
        description: "New item has been added to the menu.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding menu item",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Update menu item mutation
  const updateMenuItemMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MenuItem> & { id: number }) => {
      const { data, error } = await supabase
        .from('menu_items')
        .update({
          name: updates.name,
          price: updates.price,
          category: updates.category,
          description: updates.description,
          available: updates.available,
          image_url: updates.image,
          allergens: updates.allergens,
          preparation_time: updates.preparationTime
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast({
        title: "Menu Item Updated",
        description: "Item has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating menu item",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete menu item mutation
  const deleteMenuItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      toast({
        title: "Menu Item Deleted",
        description: "Item has been removed from the menu.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting menu item",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('menu-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_items'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['menuItems'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return {
    menuItems,
    isLoading,
    error: error instanceof Error ? error.message : null,
    addMenuItem: (item: Omit<MenuItem, "id">) => addMenuItemMutation.mutate(item),
    updateMenuItem: (id: number, updates: Partial<MenuItem>) => 
      updateMenuItemMutation.mutate({ id, ...updates }),
    deleteMenuItem: (id: number) => deleteMenuItemMutation.mutate(id),
    updateMenuItemAvailability: (id: number, available: boolean) => 
      updateMenuItemMutation.mutate({ id, available }),
    updateMenuItemPrice: (id: number, price: number) => 
      updateMenuItemMutation.mutate({ id, price }),
  };
};
