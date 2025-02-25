
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInventoryData } from "@/hooks/dashboard/useInventoryData";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryStats } from "./InventoryStats";
import { InventoryItemCard } from "./InventoryItemCard";
import { InventoryFilters } from "./InventoryFilters";
import { InventoryAnalytics } from "./InventoryAnalytics";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState("items");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [stockFilter, setStockFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  const { inventoryItems, isLoading, updateQuantity, addItem } = useInventoryData(autoRefresh);

  const maxPrice = useMemo(() => {
    return Math.max(...inventoryItems.map(item => item.price), 0);
  }, [inventoryItems]);

  const filteredItems = useMemo(() => {
    let filtered = [...inventoryItems];

    if (activeCategory !== "all") {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

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

    filtered = filtered.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

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

  const handleBatchUpdate = (action: 'increment' | 'decrement') => {
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select items to update",
        variant: "destructive"
      });
      return;
    }

    selectedItems.forEach(itemId => {
      const item = inventoryItems.find(i => i.id === itemId);
      if (item) {
        const newQuantity = action === 'increment' ? item.quantity + 1 : item.quantity - 1;
        if (newQuantity >= 0) {
          updateQuantity(itemId, newQuantity);
        }
      }
    });

    setSelectedItems([]);
    toast({
      title: "Batch Update Complete",
      description: `Updated ${selectedItems.length} items`
    });
  };

  const toggleItemSelection = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <InventoryHeader 
        autoRefresh={autoRefresh}
        onAutoRefreshToggle={setAutoRefresh}
        onAddItem={addItem}
        inventoryItems={inventoryItems}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="items">Inventory Items</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <div className="space-y-6">
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

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <Button onClick={() => handleBatchUpdate('increment')}>
                  Increment Selected (+1)
                </Button>
                <Button onClick={() => handleBatchUpdate('decrement')}>
                  Decrement Selected (-1)
                </Button>
                <Button variant="outline" onClick={() => setSelectedItems([])}>
                  Clear Selection
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedItems.length} items selected
                </span>
              </div>
            )}

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
              <TabsList>
                {["all", "produce", "meat", "dairy", "dry goods", "beverages"].map((category) => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {["all", "produce", "meat", "dairy", "dry goods", "beverages"].map((category) => (
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
                        <div key={item.id} className="relative">
                          <div className="absolute top-2 right-2 z-10">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => toggleItemSelection(item.id)}
                            />
                          </div>
                          <InventoryItemCard
                            item={item}
                            onUpdateQuantity={updateQuantity}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <InventoryAnalytics inventoryItems={inventoryItems} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
