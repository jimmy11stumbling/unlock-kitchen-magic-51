
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  price: number;
  category: string;
  description?: string;
  sku?: string;
  location?: string;
  reorderPoint: number;
  idealStockLevel: number;
  lastOrderedAt?: string;
  categoryId?: string;
  supplierId?: string;
}

export interface InventoryHistory {
  id: string;
  itemId: number;
  action: string;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  createdAt: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export function useInventoryData(autoRefresh: boolean) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inventoryItems = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select(`
          *,
          ingredient_categories(id, name, description),
          suppliers(id, name)
        `);

      if (error) throw error;

      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.current_stock,
        unit: item.unit,
        minQuantity: item.minimum_stock,
        price: item.cost_per_unit,
        category: item.ingredient_categories?.name || 'Uncategorized',
        description: item.description,
        sku: item.sku,
        location: item.location,
        reorderPoint: item.reorder_point,
        idealStockLevel: item.ideal_stock_level,
        lastOrderedAt: item.last_ordered_at,
        categoryId: item.category_id,
        supplierId: item.supplier_id
      }));
    },
    refetchInterval: autoRefresh ? 30000 : false
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['inventory-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredient_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['inventory-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    }
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number, quantity: number }) => {
      const { error } = await supabase
        .from('ingredients')
        .update({ current_stock: quantity })
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-history'] });
      toast({
        title: "Inventory Updated",
        description: "Item quantity has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update inventory quantity: " + error.message,
        variant: "destructive",
      });
    }
  });

  const addItemMutation = useMutation({
    mutationFn: async (item: Omit<InventoryItem, "id">) => {
      const { error } = await supabase
        .from('ingredients')
        .insert({
          name: item.name,
          current_stock: item.quantity,
          unit: item.unit,
          minimum_stock: item.minQuantity,
          cost_per_unit: item.price,
          category_id: item.categoryId,
          description: item.description,
          sku: item.sku,
          location: item.location,
          reorder_point: item.reorderPoint,
          ideal_stock_level: item.idealStockLevel,
          supplier_id: item.supplierId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-items'] });
      toast({
        title: "Item Added",
        description: "New item has been added to inventory",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add new item: " + error.message,
        variant: "destructive",
      });
    }
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (category: Omit<Category, "id">) => {
      const { error } = await supabase
        .from('ingredient_categories')
        .insert(category);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-categories'] });
      toast({
        title: "Category Added",
        description: "New category has been created",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add category: " + error.message,
        variant: "destructive",
      });
    }
  });

  return {
    inventoryItems,
    categories,
    history,
    isLoading: isLoadingItems || isLoadingCategories || isLoadingHistory,
    updateQuantity: (itemId: number, quantity: number) => {
      if (quantity >= 0) {
        updateQuantityMutation.mutate({ itemId, quantity });
      }
    },
    addItem: (item: Omit<InventoryItem, "id">) => {
      addItemMutation.mutate(item);
    },
    addCategory: (category: Omit<Category, "id">) => {
      addCategoryMutation.mutate(category);
    }
  };
}
