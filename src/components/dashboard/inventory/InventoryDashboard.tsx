
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Package, AlertTriangle, RefreshCcw, Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { InventoryItem } from "@/types/staff";

interface SupabaseInventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  min_quantity: number;
  price: number;
  category: string;
  last_updated: string;
  supplier_id: number;
}

export function InventoryDashboard() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: inventoryItems = [], isLoading, refetch } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      // Using raw query with RPC to get inventory items
      const { data, error } = await supabase
        .rpc('get_inventory_items')
        .select('*');

      if (error) throw error;

      const items = (data as unknown) as SupabaseInventoryItem[];
      
      return items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        minQuantity: item.min_quantity,
        price: item.price,
        category: item.category,
      }));
    },
    refetchInterval: autoRefresh ? 30000 : false
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number, quantity: number }) => {
      // Using RPC call to update inventory item quantity
      const { error } = await supabase
        .rpc('update_inventory_item_quantity', {
          p_item_id: itemId,
          p_quantity: quantity,
          p_last_updated: new Date().toISOString()
        });

      if (error) throw error;
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

  const categories = ["all", "produce", "meat", "dairy", "dry goods", "beverages"];

  const filteredItems = activeCategory === "all" 
    ? inventoryItems 
    : inventoryItems.filter(item => item.category === activeCategory);

  const getLowStockItems = () => 
    inventoryItems.filter(item => item.quantity <= item.minQuantity);

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity >= 0) {
      updateQuantityMutation.mutate({ itemId, quantity });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">Track and manage kitchen inventory</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-primary/10" : ""}
          >
            <RefreshCcw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="p-4 bg-yellow-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold">Low Stock Alert</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {getLowStockItems().length} items below minimum quantity
          </p>
        </Card>
        <Card className="p-4 bg-blue-50">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Total Items</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {inventoryItems.length} items in inventory
          </p>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <p>Loading inventory...</p>
              ) : filteredItems.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground py-8">
                  No items found in this category
                </p>
              ) : (
                filteredItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Category: {item.category}
                        </p>
                      </div>
                      {item.quantity <= item.minQuantity && (
                        <Badge variant="destructive">Low Stock</Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="min-w-[3rem] text-center">
                            {item.quantity} {item.unit}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Min Quantity:</span>
                        <span>{item.minQuantity} {item.unit}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Price per {item.unit}:</span>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
