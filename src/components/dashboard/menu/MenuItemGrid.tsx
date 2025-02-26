
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2 } from "lucide-react";
import type { MenuItem } from "@/types/staff";

interface MenuItemGridProps {
  items: MenuItem[];
  onUpdateAvailability: (itemId: number, available: boolean) => void;
  onUpdateMenuItem?: (itemId: number, item: Partial<MenuItem>) => void;
  onDeleteMenuItem?: (itemId: number) => void;
}

export const MenuItemGrid = ({
  items,
  onUpdateAvailability,
  onUpdateMenuItem,
  onDeleteMenuItem,
}: MenuItemGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="font-semibold">${item.price.toFixed(2)}</p>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <div className="flex flex-wrap gap-1">
              {item.allergens.map((allergen) => (
                <span
                  key={allergen}
                  className="px-2 py-1 text-xs bg-muted rounded-full"
                >
                  {allergen}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={item.available}
                  onCheckedChange={(checked) => onUpdateAvailability(item.id, checked)}
                />
                <span className="text-sm">
                  {item.available ? "Available" : "Unavailable"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateMenuItem?.(item.id, item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDeleteMenuItem?.(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
