
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Ingredient, MenuItemIngredientJoin } from './types/ingredientTypes';
import { 
  isValidStockQuantity, 
  isValidPrepDetails,
  DEFAULT_PREP_TIME,
  MAX_RETRIES,
  BASE_RETRY_DELAY 
} from './utils/ingredientValidation';
import { handleDatabaseError } from './utils/errorHandling';
import { useIngredientRealtime } from './useIngredientRealtime';

export const useIngredientManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Set up realtime subscription
  useIngredientRealtime(queryClient);

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
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Update ingredient stock with comprehensive validation and error handling
  const updateStockMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid ingredient ID');
      }

      if (!isValidStockQuantity(quantity)) {
        throw new Error(`Invalid stock quantity. Must be between ${0} and ${100000}`);
      }

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

export type { Ingredient, MenuItemIngredient } from './types/ingredientTypes';
