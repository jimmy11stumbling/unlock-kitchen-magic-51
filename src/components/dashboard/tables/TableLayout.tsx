
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderDialog } from "./OrderDialog";
import { TableStatus, TableData, Order } from "@/types/staff";
import { Clock, Users, Utensils, DollarSign, CircleAlert } from "lucide-react";

interface TableLayoutProps {
  tables: TableData[];
  orders: Order[];
  onTableStatusChange?: (tableId: number, status: TableStatus) => void;
  onCreateOrder?: (tableId: number, serverName: string) => void;
  onPayOrder?: (tableId: number, orderId: number) => void;
}

export function TableLayout({ 
  tables, 
  orders,
  onTableStatusChange,
  onCreateOrder,
  onPayOrder
}: TableLayoutProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  const sections = Array.from(new Set(tables.map(table => table.section)));
  
  // Filter tables by section if one is selected
  const filteredTables = activeSection 
    ? tables.filter(table => table.section === activeSection)
    : tables;

  const getTableStatusColor = (status: TableStatus) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "occupied": return "bg-red-500";
      case "reserved": return "bg-blue-500";
      case "dirty": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getTableOrder = (tableId: number) => {
    return orders.find(order => order.tableNumber === tableId && order.status !== "completed" && order.status !== "cancelled");
  };

  const handleTableClick = (table: TableData) => {
    setSelectedTable(table);
  };

  const handleStatusChange = (status: TableStatus) => {
    if (selectedTable && onTableStatusChange) {
      onTableStatusChange(selectedTable.id, status);
      setSelectedTable(null);
    }
  };

  const handleCreateOrder = () => {
    if (selectedTable) {
      setIsOrderDialogOpen(true);
    }
  };

  const handleOrderSubmit = (serverName: string) => {
    if (selectedTable && onCreateOrder) {
      onCreateOrder(selectedTable.id, serverName);
      setIsOrderDialogOpen(false);
      setSelectedTable(null);
    }
  };

  const handlePayBill = () => {
    if (selectedTable) {
      const order = getTableOrder(selectedTable.id);
      if (order && onPayOrder) {
        onPayOrder(selectedTable.id, order.id);
        setSelectedTable(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Tabs defaultValue="all" className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setActiveSection(null)}>
              All Sections
            </TabsTrigger>
            {sections.map((section) => (
              <TabsTrigger
                key={section}
                value={section}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Reserved</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Dirty</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredTables.map((table) => {
          const tableOrder = getTableOrder(table.id);
          
          return (
            <Card 
              key={table.id} 
              className={`cursor-pointer transform transition-all hover:scale-105 ${
                table.status === "occupied" ? "shadow-md" : ""
              }`}
              onClick={() => handleTableClick(table)}
            >
              <CardContent className="p-4">
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold">Table {table.id}</h3>
                    <div className={`w-3 h-3 rounded-full ${getTableStatusColor(table.status)}`}></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{table.capacity}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="text-xs">
                        {table.section}
                      </Badge>
                    </div>
                  </div>

                  {tableOrder && (
                    <div className="mt-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Utensils className="h-3 w-3 mr-1" />
                        <span>Order #{tableOrder.id}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {new Date(tableOrder.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center font-medium mt-1">
                        <DollarSign className="h-3 w-3 mr-1" />
                        <span>
                          ${tableOrder.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {table.status === "available" && table.reservation && (
                    <div className="mt-2 flex items-center text-sm text-blue-500">
                      <CircleAlert className="h-3 w-3 mr-1" />
                      <span>Reserved {table.reservation}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Table Action Dialog */}
      <Dialog open={!!selectedTable} onOpenChange={(open) => !open && setSelectedTable(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Table {selectedTable?.id} - {selectedTable?.section}</DialogTitle>
            <DialogDescription>
              Capacity: {selectedTable?.capacity} | Status: {selectedTable?.status}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedTable?.status === "occupied" && (
              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Current Order</h4>
                {getTableOrder(selectedTable.id) ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Order #{getTableOrder(selectedTable.id)?.id}</span>
                      <Badge>{getTableOrder(selectedTable.id)?.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span className="font-bold">${getTableOrder(selectedTable.id)?.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Items</span>
                      <span>{getTableOrder(selectedTable.id)?.items.length || 0}</span>
                    </div>
                  </div>
                ) : (
                  <p>No active order</p>
                )}
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {selectedTable?.status === "available" && (
                <>
                  <Button onClick={() => handleStatusChange("occupied")}>Seat Guests</Button>
                  <Button onClick={() => handleStatusChange("reserved")} variant="outline">Mark Reserved</Button>
                </>
              )}
              
              {selectedTable?.status === "occupied" && (
                <>
                  {getTableOrder(selectedTable.id) ? (
                    <Button onClick={handlePayBill} variant="default">
                      <DollarSign className="h-4 w-4 mr-1" /> Pay Bill
                    </Button>
                  ) : (
                    <Button onClick={handleCreateOrder} variant="default">
                      <Utensils className="h-4 w-4 mr-1" /> Create Order
                    </Button>
                  )}
                  <Button onClick={() => handleStatusChange("dirty")} variant="outline">Clear Table</Button>
                </>
              )}
              
              {selectedTable?.status === "reserved" && (
                <>
                  <Button onClick={() => handleStatusChange("occupied")}>Seat Guests</Button>
                  <Button onClick={() => handleStatusChange("available")} variant="outline">Remove Reservation</Button>
                </>
              )}
              
              {selectedTable?.status === "dirty" && (
                <Button onClick={() => handleStatusChange("available")} variant="default">Mark Clean</Button>
              )}
              
              <Button variant="ghost" onClick={() => setSelectedTable(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Creation Dialog */}
      <OrderDialog 
        open={isOrderDialogOpen} 
        onOpenChange={setIsOrderDialogOpen}
        onSubmit={handleOrderSubmit}
        tableId={selectedTable?.id || 0}
      />
    </div>
  );
}
