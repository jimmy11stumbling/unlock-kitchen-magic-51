
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ChefHat, Timer } from "lucide-react";
import { RecipeInstructionsDialog } from "./RecipeInstructionsDialog";
import { ItemStatusControls } from "./ItemStatusControls";
import type { KitchenOrderItem, MenuItem } from "@/types/staff";

interface OrderItemCardProps {
  item: KitchenOrderItem;
  orderId: number;
  onUpdateItemStatus: (
    orderId: number,
    itemId: number,
    status: KitchenOrderItem["status"],
    assignedChef?: string
  ) => void;
}

export function OrderItemCard({ item, orderId, onUpdateItemStatus }: OrderItemCardProps) {
  const timeElapsed = (item: KitchenOrderItem) => {
    if (!item.start_time) return 0;
    return Math.floor(
      (new Date().getTime() - new Date(item.start_time).getTime()) / 1000 / 60
    );
  };

  const isOverdue = (item: KitchenOrderItem) => {
    return item.status === "preparing" && timeElapsed(item) > 15;
  };

  const convertToMenuItem = (item: KitchenOrderItem): MenuItem => ({
    id: item.menu_item_id,
    name: item.name,
    category: item.course || "main",
    price: 0,
    description: item.notes || "",
    preparationTime: 15,
    allergens: item.allergens || [],
    available: true,
    prep_details: {
      temperature_requirements: {
        min: 165,
        max: 175,
        unit: "F"
      }
    }
  });

  return (
    <div 
      className={`p-3 rounded-lg border ${
        item.status === "ready" ? "bg-green-50" :
        item.status === "preparing" ? "bg-blue-50" :
        "bg-gray-50"
      }`}
    >
      <div className="flex justify-between">
        <div>
          <div className="font-medium">
            {item.quantity}x {item.name}
          </div>
          {item.notes && (
            <p className="text-sm text-muted-foreground">{item.notes}</p>
          )}
        </div>
        <Badge variant="outline">
          {item.cooking_station || "No Station"}
        </Badge>
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm">
        {item.status === "preparing" && (
          <>
            <Timer className="h-4 w-4" />
            <span>{timeElapsed(item)}m</span>
            {isOverdue(item) && (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
          </>
        )}
        {item.assigned_chef && (
          <div className="flex items-center gap-1 text-muted-foreground ml-auto">
            <ChefHat className="h-4 w-4" />
            <span>{item.assigned_chef}</span>
          </div>
        )}
      </div>

      <ItemStatusControls
        item={item}
        orderId={orderId}
        onUpdateItemStatus={onUpdateItemStatus}
      />

      {item.allergens && item.allergens.length > 0 && (
        <div className="mt-2 p-2 bg-red-50 rounded flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-700">
            Allergens: {item.allergens.join(", ")}
          </span>
        </div>
      )}

      <div className="mt-2">
        <RecipeInstructionsDialog item={convertToMenuItem(item)} />
      </div>
    </div>
  );
}
