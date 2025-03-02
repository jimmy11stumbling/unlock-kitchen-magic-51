
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TablePanel } from "@/components/dashboard/TablePanel";
import { useDashboardState } from "@/hooks/useDashboardState";
import type { TableLayout } from "@/types/staff/table";

const Tables = () => {
  const { toast } = useToast();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const { 
    tables, 
    addTable, 
    updateTableStatus,
    startOrder
  } = useDashboardState();

  return (
    <TablePanel
      tables={tables as unknown as TableLayout[]}
      onAddTable={addTable as any}
      onUpdateStatus={updateTableStatus}
      onStartOrder={(tableId) => {
        const orderId = startOrder(tableId);
        if (orderId) setSelectedOrderId(orderId);
        return orderId;
      }}
    />
  );
};

export default Tables;
