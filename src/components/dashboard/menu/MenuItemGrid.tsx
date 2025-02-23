
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Clock, Info, DollarSign, Image, Edit2, Trash2 } from "lucide-react";
import type { MenuItem } from "@/types/staff";

interface MenuItemGridProps {
  items: MenuItem[];
  onUpdateAvailability: (itemId: number, available: boolean) => void;
  onUpdatePrice: (itemId: number, price: number) => void;
  onEdit: (item: MenuItem) => void;
  onDelete?: (itemId: number) => void;
}

export const MenuItemGrid = ({
  items,
  onUpdateAvailability,
  onUpdatePrice,
  onEdit,
  onDelete,
}: MenuItemGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <div className="relative aspect-video">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Image className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Switch
                checked={item.available}
                onCheckedChange={(checked) => onUpdateAvailability(item.id, checked)}
              />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {item.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              {item.preparationTime} min
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Info className="h-4 w-4" />
              {item.allergens.join(", ") || "No allergens"}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) => onUpdatePrice(item.id, Number(e.target.value))}
                  className="w-20"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(item)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                {onDelete && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
