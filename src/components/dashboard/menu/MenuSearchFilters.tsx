
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MenuItem } from "@/types/staff";

interface MenuSearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: MenuItem["category"] | "all";
  onCategoryChange: (category: MenuItem["category"] | "all") => void;
  sortBy: "name" | "price" | "category";
  onSortChange: (sort: "name" | "price" | "category") => void;
  availabilityFilter: "all" | "available" | "unavailable";
  onAvailabilityChange: (filter: "all" | "available" | "unavailable") => void;
}

export const MenuSearchFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  availabilityFilter,
  onAvailabilityChange,
}: MenuSearchFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input
        placeholder="Search menu items..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
      <div className="flex gap-2">
        <Select
          value={selectedCategory}
          onValueChange={(value: MenuItem["category"] | "all") => onCategoryChange(value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="appetizer">Appetizers</SelectItem>
            <SelectItem value="main">Main Courses</SelectItem>
            <SelectItem value="dessert">Desserts</SelectItem>
            <SelectItem value="beverage">Beverages</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value: "name" | "price" | "category") => onSortChange(value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={availabilityFilter}
          onValueChange={(value: "all" | "available" | "unavailable") =>
            onAvailabilityChange(value)
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
