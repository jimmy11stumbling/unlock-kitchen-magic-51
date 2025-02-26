
import { useState, useMemo } from "react";
import { useInventoryData } from "@/hooks/dashboard/useInventoryData";
import { InventoryHeader } from "./InventoryHeader";
import { InventoryTabs } from "./components/InventoryTabs";
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

      <InventoryTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        inventoryItems={inventoryItems}
        lowStockItems={lowStockItems}
        filteredItems={filteredItems}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
        maxPrice={maxPrice}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        selectedItems={selectedItems}
        onBatchUpdate={handleBatchUpdate}
        onClearSelection={() => setSelectedItems([])}
        onItemSelect={toggleItemSelection}
        onUpdateQuantity={updateQuantity}
        isLoading={isLoading}
      />
    </div>
  );
}
