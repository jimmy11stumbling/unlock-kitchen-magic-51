
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RealtimeChannel, PostgrestError } from '@supabase/supabase-js';
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

// Interface for the data structure returned from the join query
interface MenuItemIngredientJoin {
  quantity: number;
  ingredient_id: number;
  ingredients: Ingredient;
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
const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 1000;

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
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    return false;
  }
  return quantity >= MINIMUM_STOCK_THRESHOLD && 
         quantity <= MAXIMUM_STOCK_THRESHOLD &&
         Number.isInteger(quantity);
};

const handleDatabaseError = (error: PostgrestError): never => {
  if (error.code === '42P01') {
    throw new Error('Ingredients table not found. Please ensure the database is properly set up.');
  }
  if (error.code === '28P01') {
    throw new Error('Database connection error. Please check your credentials.');
  }
  if (error.code === '23505') {
    throw new Error('This ingredient already exists.');
  }
  throw new Error(`Database error: ${error.message}`);
};

export const useIngredientManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null);

  // Fetch ingredients with comprehensive error handling and retry logic
  const { 
    data: ingredients = [], 
    isLoading,
    error: ingredientsError,
    isError
  } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async ({ signal }) => {
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .select('*')
          .order('name')
          .abortSignal(signal);
        
        if (error) {
          return handleDatabaseError(error);
        }

        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid data format received from database');
        }

        return data as Ingredient[];
      } catch (err) {
        console.error('Error fetching ingredients:', err);
        throw err;
      }
    },
    retry: MAX_RETRIES,
    retryDelay: (attemptIndex) => Math.min(BASE_RETRY_DELAY * 2 ** attemptIndex, 30000),
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  });

  // Update ingredient stock with comprehensive validation and error handling
  const updateStockMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      // Pre-validation
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid ingredient ID');
      }

      if (!isValidStockQuantity(quantity)) {
        throw new Error(`Invalid stock quantity. Must be between ${MINIMUM_STOCK_THRESHOLD} and ${MAXIMUM_STOCK_THRESHOLD}`);
      }

      // Check if ingredient exists before updating
      const { data: existingIngredient, error: checkError } = await supabase
        .from('ingredients')
        .select('id')
        .eq('id', id)
        .single();

      if (checkError) {
        return handleDatabaseError(checkError);
      }

      if (!existingIngredient) {
        throw new Error('Ingredient not found');
      }

      // Perform update with retry logic
      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          const { data, error } = await supabase
            .from('ingredients')
            .update({ 
              current_stock: quantity,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();
          
          if (error) {
            return handleDatabaseError(error);
          }

          return data;
        } catch (err) {
          retries++;
          if (retries === MAX_RETRIES) throw err;
          await new Promise(resolve => setTimeout(resolve, BASE_RETRY_DELAY * 2 ** retries));
        }
      }
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
      const ingredients = ingredientsResult.data as MenuItemIngredientJoin[];

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
    isError,
    error: ingredientsError,
    updateStock: (id: number, quantity: number) => updateStockMutation.mutate({ id, quantity }),
    isUpdating: updateStockMutation.isPending,
    updateError: updateStockMutation.error,
    calculatePrepTime,
    checkLowStock,
  };
};
