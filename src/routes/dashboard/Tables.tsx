
import { TablePanel } from "@/components/dashboard/TablePanel";
import { OrderDetails } from "@/components/dashboard/OrderDetails";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useState } from "react";

const Tables = () => {
  const { 
    tables, 
    orders,
    menuItems, // This comes from useMenuState via useDashboardState
    addTable, 
    updateTableStatus, 
    startOrder,
    updateOrder,
    sendToKitchen
  } = useDashboardState();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const selectedOrder = selectedOrderId ? orders.find(o => o.id === selectedOrderId) : null;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Table Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <TablePanel
            tables={tables}
            onAddTable={addTable}
            onUpdateStatus={updateTableStatus}
            onStartOrder={(tableId) => {
              const orderId = startOrder(tableId);
              if (orderId) setSelectedOrderId(orderId);
              return orderId;
            }}
          />
        </div>
        <div>
          {selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              menuItems={menuItems || []} // Pass menu items to OrderDetails
              onUpdateOrder={updateOrder}
              onSendToKitchen={sendToKitchen}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Tables;
