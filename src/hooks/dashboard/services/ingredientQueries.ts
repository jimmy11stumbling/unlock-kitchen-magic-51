
import { supabase } from '@/integrations/supabase/client';
import { Ingredient, MenuItemIngredientJoin } from '../types/ingredientTypes';
import { handleDatabaseError } from '../utils/errorHandling';
import { MAX_RETRIES, BASE_RETRY_DELAY } from '../utils/ingredientValidation';

export const fetchIngredients = async (signal?: AbortSignal) => {
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
};

export const updateIngredientStock = async (id: number, quantity: number) => {
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
};

export const checkIngredientExists = async (id: number) => {
  const { data, error } = await supabase
    .from('ingredients')
    .select('id')
    .eq('id', id)
    .single();

  if (error) {
    return handleDatabaseError(error);
  }

  return data;
};

export const fetchMenuItemPrep = async (menuItemId: number) => {
  return Promise.all([
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
};
