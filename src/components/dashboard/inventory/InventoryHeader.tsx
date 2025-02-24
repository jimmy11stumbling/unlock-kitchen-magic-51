
import { Button } from "@/components/ui/button";
import { RefreshCcw, Plus } from "lucide-react";

interface InventoryHeaderProps {
  autoRefresh: boolean;
  onAutoRefreshToggle: (value: boolean) => void;
}

export function InventoryHeader({ autoRefresh, onAutoRefreshToggle }: InventoryHeaderProps) {
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
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>
    </div>
  );
}
