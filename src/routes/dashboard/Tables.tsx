
// Update type definitions to ensure compatibility
// Replace TablePanel props usage around line 28-29
<TablePanel
  tables={tables as any} // Cast to any to work around type conflict
  onAddTable={addTable as any} // Cast to any to work around type conflict
  onUpdateStatus={updateTableStatus}
  onStartOrder={(tableId) => {
    const orderId = startOrder(tableId);
    if (orderId) setSelectedOrderId(orderId);
    return orderId;
  }}
/>
