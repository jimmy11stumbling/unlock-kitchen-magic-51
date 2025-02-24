
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface SupplierIngredient {
  id: string;
  supplier_id: string;
  ingredient_id: number;
  unit_price: number;
  minimum_order_quantity: number;
  lead_time_days: number;
  created_at?: string;
  updated_at?: string;
  ingredients?: {
    name: string;
    unit: string;
  };
}

export const useSupplierIngredients = (supplierId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: supplierIngredients = [], isLoading } = useQuery({
    queryKey: ['supplier-ingredients', supplierId],
    queryFn: async () => {
      const query = supabase
        .from('supplier_ingredients')
        .select(`
          *,
          ingredients (name, unit)
        `)
        .order('created_at');

      if (supplierId) {
        query.eq('supplier_id', supplierId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as SupplierIngredient[];
    },
    enabled: !!supplierId
  });

  const addSupplierIngredientMutation = useMutation({
    mutationFn: async (data: Omit<SupplierIngredient, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('supplier_ingredients')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-ingredients'] });
      toast({
        title: "Ingredient Added",
        description: "Supplier ingredient has been added successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add supplier ingredient: " + error.message,
        variant: "destructive"
      });
    }
  });

  const updateSupplierIngredientMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SupplierIngredient> & { id: string }) => {
      const { data, error } = await supabase
        .from('supplier_ingredients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-ingredients'] });
      toast({
        title: "Updated",
        description: "Supplier ingredient has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update supplier ingredient: " + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteSupplierIngredientMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('supplier_ingredients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplier-ingredients'] });
      toast({
        title: "Deleted",
        description: "Supplier ingredient has been removed successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete supplier ingredient: " + error.message,
        variant: "destructive"
      });
    }
  });

  return {
    supplierIngredients,
    isLoading,
    addSupplierIngredient: (data: Omit<SupplierIngredient, 'id' | 'created_at' | 'updated_at'>) => 
      addSupplierIngredientMutation.mutate(data),
    updateSupplierIngredient: (id: string, updates: Partial<Omit<SupplierIngredient, 'id'>>) => 
      updateSupplierIngredientMutation.mutate({ id, ...updates }),
    deleteSupplierIngredient: (id: string) => 
      deleteSupplierIngredientMutation.mutate(id),
  };
};
