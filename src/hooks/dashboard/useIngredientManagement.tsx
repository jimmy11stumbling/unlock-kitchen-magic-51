
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Ingredient {
  id: number;
  name: string;
  current_stock: number;
  unit: string;
  minimum_stock: number;
  cost_per_unit: number;
}

export interface MenuItemIngredient {
  id: number;
  menu_item_id: number;
  ingredient_id: number;
  quantity: number;
  unit: string;
}

export const useIngredientManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);

  // Fetch ingredients
  const { data: ingredients = [], isLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Ingredient[];
    }
  });

  // Update ingredient stock
  const updateStockMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const { data, error } = await supabase
        .from('ingredients')
        .update({ current_stock: quantity })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      toast({
        title: "Stock Updated",
        description: "Ingredient stock has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update ingredient stock: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Calculate prep time for a menu item based on ingredients and steps
  const calculatePrepTime = async (menuItemId: number) => {
    const { data: menuItem } = await supabase
      .from('menu_items')
      .select('prep_details')
      .eq('id', menuItemId)
      .single();

    const { data: ingredients } = await supabase
      .from('menu_item_ingredients')
      .select('quantity, ingredient_id, ingredients!inner(*)')
      .eq('menu_item_id', menuItemId);

    if (!menuItem || !ingredients) return 15; // Default prep time

    const steps = menuItem.prep_details?.steps || [];
    const baseTime = steps.reduce((total: number, step: any) => total + (step.duration || 0), 0);
    
    // Add complexity factor based on number of ingredients
    const complexityFactor = Math.ceil(ingredients.length / 3) * 5;
    
    return baseTime + complexityFactor;
  };

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('ingredients-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ingredients' },
        (payload) => {
          console.log('Realtime update:', payload);
          queryClient.invalidateQueries({ queryKey: ['ingredients'] });
        }
      )
      .subscribe();

    setRealtimeChannel(channel);

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [queryClient]);

  // Check for low stock
  const checkLowStock = () => {
    return ingredients.filter(ing => ing.current_stock <= ing.minimum_stock);
  };

  return {
    ingredients,
    isLoading,
    updateStock: (id: number, quantity: number) => updateStockMutation.mutate({ id, quantity }),
    calculatePrepTime,
    checkLowStock,
  };
};
