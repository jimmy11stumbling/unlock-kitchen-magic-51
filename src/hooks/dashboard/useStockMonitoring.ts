
import type { Ingredient } from './types/ingredientTypes';

export const useStockMonitoring = (ingredients: Ingredient[]) => {
  const checkLowStock = (): Ingredient[] => {
    return ingredients.filter(ing => ing.current_stock <= ing.minimum_stock);
  };

  return { checkLowStock };
};
