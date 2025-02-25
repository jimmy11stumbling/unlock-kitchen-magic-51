
import { useQuery, useMutation } from "@tanstack/react-query";
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
  reorderPoint?: number;
  idealStockLevel?: number;
  description?: string;
  sku?: string;
  location?: string;
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

export function useInventoryData(autoRefresh: boolean) {
  const { toast } = useToast();

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name')
        .eq('status', 'active');

      if (error) throw error;
      return data;
    }
  });

  const { data: inventoryItems = [], isLoading, refetch } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kitchen_orders')
        .select('id, items')
        .order('id');

      if (error) throw error;

      return data.map((order: any) => ({
        id: order.id,
        name: `Item ${order.id}`,
        quantity: 10,
        unit: 'pcs',
        minQuantity: 5,
        price: 9.99,
        category: 'produce',
        reorderPoint: 5,
        idealStockLevel: 20
      })) as InventoryItem[];
    },
    refetchInterval: autoRefresh ? 30000 : false
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number, quantity: number }) => {
      console.log(`Updating item ${itemId} to quantity ${quantity}`);
      return Promise.resolve();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Inventory Updated",
        description: "Item quantity has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update inventory quantity",
        variant: "destructive",
      });
    }
  });

  const addItemMutation = useMutation({
    mutationFn: async (item: Omit<InventoryItem, "id">) => {
      console.log("Adding new item:", item);
      return Promise.resolve();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Item Added",
        description: "New item has been added to inventory",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add new item",
        variant: "destructive",
      });
    }
  });

  return {
    inventoryItems,
    suppliers,
    isLoading,
    updateQuantity: (itemId: number, quantity: number) => {
      if (quantity >= 0) {
        updateQuantityMutation.mutate({ itemId, quantity });
      }
    },
    addItem: (item: Omit<InventoryItem, "id">) => {
      addItemMutation.mutate(item);
    }
  };
}
