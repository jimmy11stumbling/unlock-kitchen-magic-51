
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchIngredients } from './services/ingredientQueries';
import { useIngredientRealtime } from './useIngredientRealtime';
import { useIngredientMutations } from './useIngredientMutations';
import { usePrepTimeCalculator } from './usePrepTimeCalculator';
import { useStockMonitoring } from './useStockMonitoring';
import { MAX_RETRIES, BASE_RETRY_DELAY } from './utils/ingredientValidation';

export const useIngredientManagement = () => {
  const queryClient = useQueryClient();
  
  // Set up realtime subscription
  useIngredientRealtime(queryClient);

  // Fetch ingredients
  const { 
    data: ingredients = [], 
    isLoading,
    error: ingredientsError,
    isError
  } = useQuery({
    queryKey: ['ingredients'],
    queryFn: ({ signal }) => fetchIngredients(signal),
    retry: MAX_RETRIES,
    retryDelay: (attemptIndex) => Math.min(BASE_RETRY_DELAY * 2 ** attemptIndex, 30000),
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  // Get mutation handlers
  const { updateStock, isUpdating, updateError } = useIngredientMutations();

  // Get prep time calculator
  const { calculatePrepTime } = usePrepTimeCalculator();

  // Get stock monitoring
  const { checkLowStock } = useStockMonitoring(ingredients);

  return {
    ingredients,
    isLoading,
    isError,
    error: ingredientsError,
    updateStock,
    isUpdating,
    updateError,
    calculatePrepTime,
    checkLowStock,
  };
};

export type { Ingredient, MenuItemIngredient } from './types/ingredientTypes';
