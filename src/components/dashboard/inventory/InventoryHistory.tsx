
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import type { InventoryHistory } from "@/hooks/dashboard/useInventoryData";

interface InventoryHistoryProps {
  history: InventoryHistory[];
}

export function InventoryHistory({ history }: InventoryHistoryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Changes</h3>
      <div className="space-y-2">
        {history.map((record) => (
          <Card key={record.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {record.action.charAt(0).toUpperCase() + record.action.slice(1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Quantity changed by: {record.quantityChange}
                  {record.previousQuantity !== null && (
                    <> (from {record.previousQuantity} to {record.newQuantity})</>
                  )}
                </p>
                {record.notes && (
                  <p className="text-sm text-muted-foreground mt-1">{record.notes}</p>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {format(new Date(record.createdAt), 'MMM d, yyyy HH:mm')}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
