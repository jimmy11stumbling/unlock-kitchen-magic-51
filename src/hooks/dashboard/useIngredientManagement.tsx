
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

interface PrepDetails {
  steps: Array<{ duration: number }>;
  equipment_needed: string[];
}

const isValidPrepDetails = (data: unknown): data is PrepDetails => {
  if (typeof data !== 'object' || !data) return false;
  
  const details = data as Record<string, unknown>;
  return (
    Array.isArray(details.steps) &&
    Array.isArray(details.equipment_needed) &&
    details.steps.every(step => 
      typeof step === 'object' && 
      step !== null && 
      'duration' in step && 
      typeof step.duration === 'number'
    ) &&
    details.equipment_needed.every(item => typeof item === 'string')
  );
};

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

    const prepDetails = menuItem.prep_details;
    if (!isValidPrepDetails(prepDetails)) return 15; // Default prep time if invalid data
    
    const baseTime = prepDetails.steps.reduce((total: number, step) => total + (step.duration || 0), 0);
    
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
