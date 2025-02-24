
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventoryData } from "@/hooks/dashboard/useInventoryData";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { InventoryItemCard } from "./InventoryItemCard";

export function InventoryDashboard() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const { inventoryItems, isLoading, updateQuantity, addItem } = useInventoryData(autoRefresh);

  const categories = ["all", "produce", "meat", "dairy", "dry goods", "beverages"];

  const filteredItems = activeCategory === "all" 
    ? inventoryItems 
    : inventoryItems.filter(item => item.category === activeCategory);

  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.minQuantity);

  return (
    <div className="p-6 space-y-6">
      <InventoryHeader 
        autoRefresh={autoRefresh}
        onAutoRefreshToggle={setAutoRefresh}
        onAddItem={addItem}
      />

      <InventoryStats 
        inventoryItems={inventoryItems}
        lowStockCount={lowStockItems.length}
      />

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
                  <InventoryItemCard
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                  />
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
