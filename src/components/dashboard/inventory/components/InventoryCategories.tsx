
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { InventoryItemCard } from "../InventoryItemCard";
import type { InventoryItem } from "@/hooks/dashboard/useInventoryData";

interface InventoryCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  filteredItems: InventoryItem[];
  selectedItems: number[];
  onItemSelect: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  isLoading: boolean;
}

export function InventoryCategories({
  activeCategory,
  onCategoryChange,
  filteredItems,
  selectedItems,
  onItemSelect,
  onUpdateQuantity,
  isLoading,
}: InventoryCategoriesProps) {
  const categories = ["all", "produce", "meat", "dairy", "dry goods", "beverages"];

  return (
    <Tabs defaultValue="all" className="w-full" onValueChange={onCategoryChange}>
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
                <div key={item.id} className="relative">
                  <div className="absolute top-2 right-2 z-10">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => onItemSelect(item.id)}
                    />
                  </div>
                  <InventoryItemCard
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                </div>
              ))
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
