
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2 } from "lucide-react";
import type { MenuItem } from "@/types/staff";

interface MenuItemGridProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onUpdateAvailability: (id: number, available: boolean) => void;
}

export const MenuItemGrid = ({
  items,
  onEdit,
  onDelete,
  onUpdateAvailability,
}: MenuItemGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
            <Badge variant={item.available ? "default" : "secondary"}>
              {item.available ? "Available" : "Unavailable"}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Price:</span>
              <span>${item.price.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Prep Time:</span>
              <span>{item.preparationTime} mins</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Category:</span>
              <span className="capitalize">{item.category}</span>
            </div>

            {item.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.allergens.map((allergen) => (
                  <Badge key={allergen} variant="outline">
                    {allergen}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={item.available}
                  onCheckedChange={(checked) =>
                    onUpdateAvailability(item.id, checked)
                  }
                />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(item.id)}
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
