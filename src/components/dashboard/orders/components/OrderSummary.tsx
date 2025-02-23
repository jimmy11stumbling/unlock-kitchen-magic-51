
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus } from "lucide-react";
import type { MenuItem, OrderItem } from "@/types/staff";

interface OrderSummaryProps {
  selectedItems: OrderItem[];
  onAddItem: (item: MenuItem) => void;
  onRemoveItem: (item: MenuItem) => void;
  total: number;
  onSubmit: () => void;
}

export const OrderSummary = ({
  selectedItems,
  onAddItem,
  onRemoveItem,
  total,
  onSubmit
}: OrderSummaryProps) => {
  return (
    <>
      <ScrollArea className="h-[300px] mb-6">
        <div className="space-y-4">
          {selectedItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onRemoveItem({ id: item.id } as MenuItem)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onAddItem({ id: item.id, price: item.price, name: item.name } as MenuItem)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator className="my-4" />

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">${total.toFixed(2)}</span>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={onSubmit}
          disabled={selectedItems.length === 0}
        >
          Send Order to Kitchen
        </Button>
      </div>
    </>
  );
};
