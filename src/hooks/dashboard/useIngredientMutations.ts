
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { updateIngredientStock, checkIngredientExists } from './services/ingredientQueries';
import { isValidStockQuantity } from './utils/ingredientValidation';

export const useIngredientMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid ingredient ID');
      }

      if (!isValidStockQuantity(quantity)) {
        throw new Error(`Invalid stock quantity. Must be between ${0} and ${100000}`);
      }

      const existingIngredient = await checkIngredientExists(id);
      if (!existingIngredient) {
        throw new Error('Ingredient not found');
      }

      return updateIngredientStock(id, quantity);
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

  return {
    updateStock: (id: number, quantity: number) => updateStockMutation.mutate({ id, quantity }),
    isUpdating: updateStockMutation.isPending,
    updateError: updateStockMutation.error,
  };
};
