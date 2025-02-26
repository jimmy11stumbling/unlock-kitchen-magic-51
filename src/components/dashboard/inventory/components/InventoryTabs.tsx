
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { InventoryItem } from "@/hooks/dashboard/useInventoryData";
import { InventoryStats } from "../InventoryStats";
import { InventoryFilters } from "../InventoryFilters";
import { InventoryCategories } from "./InventoryCategories";
import { InventoryBatchActions } from "./InventoryBatchActions";
import { InventoryAnalytics } from "../InventoryAnalytics";

interface InventoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  inventoryItems: InventoryItem[];
  lowStockItems: InventoryItem[];
  filteredItems: InventoryItem[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  stockFilter: string;
  onStockFilterChange: (filter: string) => void;
  maxPrice: number;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  selectedItems: number[];
  onBatchUpdate: (action: 'increment' | 'decrement') => void;
  onClearSelection: () => void;
  onItemSelect: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  isLoading: boolean;
}

export function InventoryTabs({
  activeTab,
  onTabChange,
  inventoryItems,
  lowStockItems,
  filteredItems,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  stockFilter,
  onStockFilterChange,
  maxPrice,
  activeCategory,
  onCategoryChange,
  selectedItems,
  onBatchUpdate,
  onClearSelection,
  onItemSelect,
  onUpdateQuantity,
  isLoading,
}: InventoryTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
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
            onSearchChange={onSearchChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            stockFilter={stockFilter}
            onStockFilterChange={onStockFilterChange}
            maxPrice={maxPrice}
          />

          <InventoryBatchActions
            selectedItems={selectedItems}
            onBatchUpdate={onBatchUpdate}
            onClearSelection={onClearSelection}
          />

          <InventoryCategories
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
            filteredItems={filteredItems}
            selectedItems={selectedItems}
            onItemSelect={onItemSelect}
            onUpdateQuantity={onUpdateQuantity}
            isLoading={isLoading}
          />
        </div>
      </TabsContent>

      <TabsContent value="analytics">
        <InventoryAnalytics inventoryItems={inventoryItems} />
      </TabsContent>
    </Tabs>
  );
}
