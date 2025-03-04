
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { MenuItem } from "@/types/staff";

/**
 * Hook for menu item mutations (add, update, delete)
 */
export const useMenuMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return {
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
