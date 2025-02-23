
import { TablePanel } from "@/components/dashboard/TablePanel";
import { OrderDetails } from "@/components/dashboard/OrderDetails";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useState } from "react";

const Tables = () => {
  const { 
    tables, 
    orders,
    menuItems,
    addTable, 
    updateTableStatus, 
    startOrder,
    updateOrder,
    sendToKitchen
  } = useDashboardState();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const selectedOrder = selectedOrderId ? orders.find(o => o.id === selectedOrderId) : null;

  return (
    <div className="container mx-auto p-4 max-w-[1920px]">
      <h1 className="text-2xl font-bold mb-6">Table Management</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-3/4">
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
        <div className="lg:w-1/4">
          {selectedOrder && (
            <div className="sticky top-4">
              <OrderDetails
                order={selectedOrder}
                menuItems={menuItems || []}
                onUpdateOrder={updateOrder}
                onSendToKitchen={sendToKitchen}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tables;
