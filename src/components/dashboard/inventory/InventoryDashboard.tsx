
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Package, AlertTriangle, TrendingDown, 
  ShoppingCart, BarChart, ArrowUpDown 
} from "lucide-react";
import type { InventoryItem } from "@/types/staff";

export function InventoryDashboard() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('menu_items')  // Using menu_items table as a base
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      // Transform menu items into inventory items
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        quantity: 0, // Default value
        unit: "units", // Default value
        minQuantity: 10, // Default value
        price: item.price,
        category: item.category
      })) as InventoryItem[];
    }
  });

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    try {
      const { error } = await supabase
        .from('menu_items')  // Using menu_items table
        .update({ order_count: quantity })  // Using order_count as a proxy for quantity
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Inventory Updated",
        description: "Item quantity has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update inventory",
        variant: "destructive",
      });
    }
  };

  const categories = ["all", "ingredients", "supplies", "equipment"];
  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity);

  const filteredItems = activeCategory === "all" 
    ? inventory
    : inventory.filter(item => item.category === activeCategory);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Inventory Management</h2>
        <Button onClick={() => console.log("Add new item")}>
          <Package className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <Package className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{inventory.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold">{lowStockItems.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <TrendingDown className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold">
                {inventory.filter(item => item.quantity === 0).length}
              </p>
            </div>
          </div>
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
            <div className="grid grid-cols-1 gap-4">
              {isLoading ? (
                <p>Loading inventory...</p>
              ) : (
                filteredItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} {item.unit} available
                        </p>
                      </div>
                      <Badge 
                        variant={item.quantity <= item.minQuantity ? "destructive" : "default"}
                      >
                        {item.quantity <= item.minQuantity ? "Low Stock" : "In Stock"}
                      </Badge>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          -
                        </Button>
                        <span className="font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Order
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart className="w-4 h-4 mr-2" />
                          History
                        </Button>
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
