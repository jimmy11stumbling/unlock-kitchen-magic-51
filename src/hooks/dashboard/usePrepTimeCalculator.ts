
import { fetchMenuItemPrep } from './services/ingredientQueries';
import { isValidPrepDetails, DEFAULT_PREP_TIME } from './utils/ingredientValidation';
import type { MenuItemIngredientJoin } from './types/ingredientTypes';

export const usePrepTimeCalculator = () => {
  const calculatePrepTime = async (menuItemId: number): Promise<number> => {
    try {
      const [menuItemResult, ingredientsResult] = await fetchMenuItemPrep(menuItemId);

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

  return { calculatePrepTime };
};
