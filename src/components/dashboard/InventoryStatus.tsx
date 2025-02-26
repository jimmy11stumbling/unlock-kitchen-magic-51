
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Package, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InventoryItem {
  id: number;
  name: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
}

export function InventoryStatus() {
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchInventoryStatus();
    subscribeToInventoryUpdates();
  }, []);

  const subscribeToInventoryUpdates = () => {
    const channel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ingredients'
        },
        () => {
          fetchInventoryStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchInventoryStatus = async () => {
    // Instead of using raw(), we'll fetch all ingredients and filter in the application
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .order('current_stock', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch inventory status",
        variant: "destructive",
      });
      return;
    }

    // Filter items where current_stock is less than or equal to minimum_stock
    const lowStock = (data || []).filter(
      item => item.current_stock <= item.minimum_stock
    );

    setLowStockItems(lowStock);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Inventory Alerts</h3>
        </div>
        <Badge variant={lowStockItems.length > 0 ? "destructive" : "outline"}>
          {lowStockItems.length} Alerts
        </Badge>
      </div>
      <div className="space-y-3">
        {lowStockItems.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">All stock levels are normal</p>
        ) : (
          lowStockItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.name}</span>
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Low Stock
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {item.current_stock} {item.unit} remaining
                </div>
              </div>
              <div className="text-sm">
                Min: {item.minimum_stock} {item.unit}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
