
import { TablePanel } from "@/components/dashboard/TablePanel";
import { useDashboardState } from "@/hooks/useDashboardState";

const Tables = () => {
  const { tables, addTable, updateTableStatus, startOrder } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Table Management</h1>
      <TablePanel
        tables={tables}
        onAddTable={addTable}
        onUpdateStatus={updateTableStatus}
        onStartOrder={startOrder}
      />
    </div>
  );
};

export default Tables;
