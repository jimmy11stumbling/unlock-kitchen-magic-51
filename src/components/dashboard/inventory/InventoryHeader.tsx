
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { AddInventoryItemDialog } from "./AddInventoryItemDialog";
import type { InventoryItem } from "@/hooks/dashboard/useInventoryData";

interface InventoryHeaderProps {
  autoRefresh: boolean;
  onAutoRefreshToggle: (value: boolean) => void;
  onAddItem: (item: Omit<InventoryItem, "id">) => void;
}

export function InventoryHeader({ autoRefresh, onAutoRefreshToggle, onAddItem }: InventoryHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold">Inventory Management</h2>
        <p className="text-muted-foreground">Track and manage kitchen inventory</p>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => onAutoRefreshToggle(!autoRefresh)}
          className={autoRefresh ? "bg-primary/10" : ""}
        >
          <RefreshCcw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
          {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
        </Button>
        <AddInventoryItemDialog onAddItem={onAddItem} />
      </div>
    </div>
  );
}
