
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder } from "@/types/staff";

interface InventoryTrackerProps {
  order: KitchenOrder;
}

interface InventoryItem {
  id: number;
  name: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
}

export function InventoryTracker({ order }: InventoryTrackerProps) {
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    checkInventoryLevels();
  }, [order]);

  const checkInventoryLevels = async () => {
    try {
      // Get all menu items from the order
      const menuItemIds = order.items.map(item => item.menu_item_id);
      
      // Fetch required ingredients for these menu items
      const { data: menuItems, error: menuError } = await supabase
        .from('menu_items')
        .select('ingredient_requirements')
        .in('id', menuItemIds);

      if (menuError) throw menuError;

      // Get all unique ingredient IDs
      const ingredientIds = new Set<number>();
      menuItems?.forEach(menuItem => {
        const requirements = menuItem.ingredient_requirements as any[];
        requirements.forEach(req => {
          ingredientIds.add(req.ingredient_id);
        });
      });

      // Check current stock levels
      // Using direct comparison instead of supabase.sql
      const { data: ingredients, error: ingredientError } = await supabase
        .from('ingredients')
        .select('id, name, current_stock, minimum_stock, unit')
        .in('id', Array.from(ingredientIds))
        .filter('current_stock', 'lt', 'minimum_stock + 10');

      if (ingredientError) throw ingredientError;

      setLowStockItems(ingredients || []);

      // Show warning if any items are low in stock
      if (ingredients && ingredients.length > 0) {
        toast({
          title: "Low Stock Warning",
          description: `Some ingredients are running low on stock`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking inventory:', error);
    }
  };

  if (lowStockItems.length === 0) return null;

  return (
    <Card className="p-4 mt-4 bg-yellow-50">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
        <div>
          <h4 className="font-semibold text-yellow-800">Low Stock Warning</h4>
          <ul className="mt-2 space-y-1">
            {lowStockItems.map(item => (
              <li key={item.id} className="text-sm text-yellow-700">
                {item.name}: {item.current_stock} {item.unit} remaining
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
