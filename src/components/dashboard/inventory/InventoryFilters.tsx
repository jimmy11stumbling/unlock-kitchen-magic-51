
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface InventoryFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  stockFilter: string;
  onStockFilterChange: (value: string) => void;
  maxPrice: number;
}

export function InventoryFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  stockFilter,
  onStockFilterChange,
  maxPrice,
}: InventoryFiltersProps) {
  return (
    <div className="space-y-4 mb-6 p-4 bg-muted/20 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2 flex flex-col">
          <Label>Search Items</Label>
          <div className="flex-1 flex items-end">
            <Input
              className="h-10"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2 flex flex-col">
          <Label>Sort By</Label>
          <div className="flex-1 flex items-end">
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                <SelectItem value="quantity-asc">Quantity (Low to High)</SelectItem>
                <SelectItem value="quantity-desc">Quantity (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 flex flex-col">
          <Label>Stock Status</Label>
          <div className="flex-1 flex items-end">
            <Select value={stockFilter} onValueChange={onStockFilterChange}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Filter by stock..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 flex flex-col">
          <Label>Price Range (${priceRange[0]} - ${priceRange[1]})</Label>
          <div className="flex-1 flex items-end">
            <Slider
              min={0}
              max={maxPrice}
              step={0.01}
              value={[priceRange[0], priceRange[1]]}
              onValueChange={onPriceRangeChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
