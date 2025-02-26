
import { Button } from "@/components/ui/button";

interface InventoryBatchActionsProps {
  selectedItems: number[];
  onBatchUpdate: (action: 'increment' | 'decrement') => void;
  onClearSelection: () => void;
}

export function InventoryBatchActions({
  selectedItems,
  onBatchUpdate,
  onClearSelection,
}: InventoryBatchActionsProps) {
  if (selectedItems.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => onBatchUpdate('increment')}>
        Increment Selected (+1)
      </Button>
      <Button onClick={() => onBatchUpdate('decrement')}>
        Decrement Selected (-1)
      </Button>
      <Button variant="outline" onClick={onClearSelection}>
        Clear Selection
      </Button>
      <span className="text-sm text-muted-foreground">
        {selectedItems.length} items selected
      </span>
    </div>
  );
}
