
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import type { KitchenOrder } from '@/types/staff';

interface InventoryTrackerProps {
  order: KitchenOrder;
}

export function InventoryTracker({ order }: InventoryTrackerProps) {
  // Simulate low inventory for demo purposes
  const hasLowInventory = order.items.some(item => item.name.includes("Burger"));
  
  if (!hasLowInventory) return null;
  
  return (
    <Card className="p-3 bg-yellow-50 border-yellow-200">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <span className="text-sm text-yellow-700">
          Low inventory warning: Beef patties (5 remaining)
        </span>
      </div>
    </Card>
  );
}
