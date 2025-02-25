
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryItemCard } from "./InventoryItemCard";
import { InventoryStats } from "./InventoryStats";
import { InventoryFilters } from "./InventoryFilters";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryHistory } from "./InventoryHistory";
import { useInventoryData } from "@/hooks/dashboard/useInventoryData";
import { useState } from "react";

export function InventoryTabs() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [stockFilter, setStockFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const {
    inventoryItems,
    categories,
    history,
    isLoading,
    updateQuantity,
    addItem,
    addCategory
  } = useInventoryData(autoRefresh);

  const maxPrice = Math.max(...inventoryItems.map(item => item.price), 0);

  const filteredItems = inventoryItems.filter(item => {
    if (activeCategory !== "all" && item.category !== activeCategory) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (item.price < priceRange[0] || item.price > priceRange[1]) return false;
    
    switch (stockFilter) {
      case "in-stock":
        return item.quantity > item.minQuantity;
      case "low-stock":
        return item.quantity <= item.minQuantity && item.quantity > 0;
      case "out-of-stock":
        return item.quantity === 0;
      default:
        return true;
    }
  });

  const lowStockCount = inventoryItems.filter(item => item.quantity <= item.minQuantity).length;

  return (
    <div className="p-6 space-y-6">
      <InventoryHeader
        autoRefresh={autoRefresh}
        onAutoRefreshToggle={setAutoRefresh}
        onAddItem={addItem}
        onAddCategory={addCategory}
        categories={categories}
        inventoryItems={inventoryItems}
      />

      <InventoryStats
        inventoryItems={inventoryItems}
        lowStockCount={lowStockCount}
      />

      <Tabs defaultValue="items" className="w-full">
        <TabsList>
          <TabsTrigger value="items">Inventory Items</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <InventoryFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            stockFilter={stockFilter}
            onStockFilterChange={setStockFilter}
            maxPrice={maxPrice}
          />

          {isLoading ? (
            <p className="text-center py-8">Loading inventory...</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No items found with current filters
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          <InventoryHistory history={history} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
