
import { Card } from "@/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";
import type { InventoryItem, Reservation } from "@/types/staff";

interface AlertsPanelProps {
  inventory: InventoryItem[];
  reservations: Reservation[];
}

export const AlertsPanel = ({ inventory, reservations }: AlertsPanelProps) => {
  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity).length;
  const pendingReservations = reservations.filter(r => r.status === 'pending').length;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Alerts</h3>
      <div className="space-y-4">
        {lowStockItems > 0 && (
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="h-4 w-4" />
            <p>{lowStockItems} items low in stock</p>
          </div>
        )}
        {pendingReservations > 0 && (
          <div className="flex items-center gap-2 text-blue-600">
            <Clock className="h-4 w-4" />
            <p>{pendingReservations} reservations need confirmation</p>
          </div>
        )}
      </div>
    </Card>
  );
};
