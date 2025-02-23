
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MenuItem, OrderItem } from "@/types/staff";
import { MenuItemCard } from "./MenuItemCard";

interface MenuItemListProps {
  menuItems: MenuItem[];
  searchQuery: string;
  selectedItems: OrderItem[];
  onSearchChange: (value: string) => void;
  onAddItem: (item: MenuItem) => void;
  onRemoveItem: (item: MenuItem) => void;
}

export const MenuItemList = ({
  menuItems,
  searchQuery,
  selectedItems,
  onSearchChange,
  onAddItem,
  onRemoveItem,
}: MenuItemListProps) => {
  const filteredMenuItems = menuItems
    .filter(item => item.available)
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <>
      <Input
        placeholder="Search menu items..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="h-[600px]">
        <div className="grid grid-cols-1 gap-4">
          {filteredMenuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={selectedItems.find(selected => selected.id === item.id)?.quantity || 0}
              onAdd={onAddItem}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      </ScrollArea>
    </>
  );
};
