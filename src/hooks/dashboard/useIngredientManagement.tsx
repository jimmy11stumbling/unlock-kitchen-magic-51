
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RealtimeChannel } from '@supabase/supabase-js';
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
  ingredients?: Ingredient;
}

interface PrepDetails {
  steps: Array<{ duration: number }>;
  equipment_needed: string[];
}

interface RealtimePayload {
  commit_timestamp: string;
  errors: null | any[];
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: { [key: string]: any };
  old: { [key: string]: any };
  schema: string;
  table: string;
}

const MINIMUM_STOCK_THRESHOLD = 0;
const MAXIMUM_STOCK_THRESHOLD = 100000;
const DEFAULT_PREP_TIME = 15;

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

const isValidStockQuantity = (quantity: number): boolean => {
  return quantity >= MINIMUM_STOCK_THRESHOLD && 
         quantity <= MAXIMUM_STOCK_THRESHOLD &&
         Number.isInteger(quantity);
};

export const useIngredientManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  // Fetch ingredients with error handling and retry
  const { 
    data: ingredients = [], 
    isLoading,
    error: ingredientsError
  } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .select('*')
          .order('name');
        
        if (error) throw new Error(error.message);
        return data as Ingredient[];
      } catch (err) {
        console.error('Error fetching ingredients:', err);
        throw err;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  // Update ingredient stock with validation
  const updateStockMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      if (!isValidStockQuantity(quantity)) {
        throw new Error(`Invalid stock quantity. Must be between ${MINIMUM_STOCK_THRESHOLD} and ${MAXIMUM_STOCK_THRESHOLD}`);
      }

      const { data, error } = await supabase
        .from('ingredients')
        .update({ current_stock: quantity })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      toast({
        title: "Stock Updated",
        description: "Ingredient stock has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Calculate prep time with proper error handling
  const calculatePrepTime = async (menuItemId: number): Promise<number> => {
    try {
      const [menuItemResult, ingredientsResult] = await Promise.all([
        supabase
          .from('menu_items')
          .select('prep_details')
          .eq('id', menuItemId)
          .single(),
        supabase
          .from('menu_item_ingredients')
          .select('quantity, ingredient_id, ingredients!inner(*)')
          .eq('menu_item_id', menuItemId)
      ]);

      if (menuItemResult.error) throw new Error(menuItemResult.error.message);
      if (ingredientsResult.error) throw new Error(ingredientsResult.error.message);

      const menuItem = menuItemResult.data;
      const ingredients = ingredientsResult.data as MenuItemIngredient[];

      if (!menuItem || !ingredients) return DEFAULT_PREP_TIME;

      const prepDetails = menuItem.prep_details;
      if (!isValidPrepDetails(prepDetails)) return DEFAULT_PREP_TIME;
      
      const baseTime = prepDetails.steps.reduce((total: number, step) => total + (step.duration || 0), 0);
      const complexityFactor = Math.ceil(ingredients.length / 3) * 5;
      
      return baseTime + complexityFactor;
    } catch (error) {
      console.error('Error calculating prep time:', error);
      return DEFAULT_PREP_TIME;
    }
  };

  // Set up realtime subscription with proper typing and error handling
  useEffect(() => {
    const channel = supabase
      .channel('ingredients-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'ingredients' },
        (payload: RealtimePayload) => {
          console.log('Realtime update:', payload);
          queryClient.invalidateQueries({ queryKey: ['ingredients'] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to ingredients changes');
        }
      });

    setRealtimeChannel(channel);

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel)
          .then(() => console.log('Realtime subscription cleaned up'))
          .catch(err => console.error('Error removing channel:', err));
      }
    };
  }, [queryClient]);

  // Check for low stock with proper typing
  const checkLowStock = (): Ingredient[] => {
    return ingredients.filter(ing => ing.current_stock <= ing.minimum_stock);
  };

  return {
    ingredients,
    isLoading,
    error: ingredientsError,
    updateStock: (id: number, quantity: number) => updateStockMutation.mutate({ id, quantity }),
    isUpdating: updateStockMutation.isPending,
    updateError: updateStockMutation.error,
    calculatePrepTime,
    checkLowStock,
  };
};
