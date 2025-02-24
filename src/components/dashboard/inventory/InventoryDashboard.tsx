import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventoryData } from "@/hooks/dashboard/useInventoryData";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { InventoryItemCard } from "./InventoryItemCard";
import { InventoryFilters } from "./InventoryFilters";

export function InventoryDashboard() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [stockFilter, setStockFilter] = useState("all");
  
  const { inventoryItems, isLoading, updateQuantity, addItem } = useInventoryData(autoRefresh);

  const maxPrice = useMemo(() => {
    return Math.max(...inventoryItems.map(item => item.price), 0);
  }, [inventoryItems]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  const categories = ["all", "produce", "meat", "dairy", "dry goods", "beverages"];

  const filteredItems = useMemo(() => {
    let filtered = [...inventoryItems];

    // Category filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Stock status filter
    switch (stockFilter) {
      case "in-stock":
        filtered = filtered.filter(item => item.quantity > item.minQuantity);
        break;
      case "low-stock":
        filtered = filtered.filter(item => item.quantity <= item.minQuantity && item.quantity > 0);
        break;
      case "out-of-stock":
        filtered = filtered.filter(item => item.quantity === 0);
        break;
    }

    // Price range filter
    filtered = filtered.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "quantity-asc":
          return a.quantity - b.quantity;
        case "quantity-desc":
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [inventoryItems, activeCategory, searchQuery, sortBy, stockFilter, priceRange]);

  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.minQuantity);

  return (
    <div className="p-6 space-y-6">
      <InventoryHeader 
        autoRefresh={autoRefresh}
        onAutoRefreshToggle={setAutoRefresh}
        onAddItem={addItem}
        inventoryItems={inventoryItems}
      />

      <InventoryStats 
        inventoryItems={inventoryItems}
        lowStockCount={lowStockItems.length}
      />

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
                  No items found with current filters
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
