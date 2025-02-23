
import { InventoryPanel } from "@/components/dashboard/InventoryPanel";
import { useDashboardState } from "@/hooks/useDashboardState";

const Inventory = () => {
  const { inventory, updateInventoryQuantity, addInventoryItem } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Inventory</h1>
      <InventoryPanel 
        inventory={inventory}
        onUpdateQuantity={updateInventoryQuantity}
        onAddItem={addInventoryItem}
      />
    </div>
  );
};

export default Inventory;
