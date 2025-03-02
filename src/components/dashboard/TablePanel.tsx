
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TableLayout } from "@/types/staff/table";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface TablePanelProps {
  tables: TableLayout[];
  onAddTable: (table: Omit<TableLayout, "id">) => void;
  onUpdateStatus: (tableId: number, status: TableLayout["status"]) => void;
  onStartOrder?: (tableId: number) => number | undefined;
}

export const TablePanel = ({
  tables,
  onAddTable,
  onUpdateStatus,
  onStartOrder,
}: TablePanelProps) => {
  const { toast } = useToast();
  const [newTable, setNewTable] = useState<Omit<TableLayout, "id">>({
    tableNumber: 1,
    number: 1,
    capacity: 4,
    seats: 4,
    status: "available",
    section: "indoor",
    shape: "round",
    positionX: 0,
    positionY: 0,
    width: 100,
    height: 100,
    activeOrder: null,
  });

  const sections: { [key: string]: TableLayout[] } = {
    indoor: tables.filter(t => t.section === "indoor"),
    outdoor: tables.filter(t => t.section === "outdoor"),
    bar: tables.filter(t => t.section === "bar"),
  };

  const getStatusColor = (status: TableLayout["status"]) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "occupied": return "bg-red-100 text-red-800";
      case "reserved": return "bg-yellow-100 text-yellow-800";
      case "cleaning": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStartOrder = (tableId: number) => {
    if (onStartOrder) {
      const orderId = onStartOrder(tableId);
      if (orderId) {
        toast({
          title: "Order Started",
          description: `Order #${orderId} has been started for table ${tables.find(t => t.id === tableId)?.number}`,
        });
      }
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Table Layout</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">Add Table</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Table Number</label>
                <Input
                  type="number"
                  value={newTable.number}
                  onChange={(e) => setNewTable({ 
                    ...newTable, 
                    number: Number(e.target.value),
                    tableNumber: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Capacity</label>
                <Input
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ 
                    ...newTable, 
                    capacity: Number(e.target.value),
                    seats: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Section</label>
                <Select
                  value={newTable.section}
                  onValueChange={(value: TableLayout["section"]) =>
                    setNewTable({ ...newTable, section: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indoor">Indoor</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                    <SelectItem value="bar">Bar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  onAddTable({
                    ...newTable,
                    tableNumber: newTable.number,
                    seats: newTable.capacity
                  });
                  setNewTable({
                    tableNumber: tables.length + 1,
                    number: tables.length + 1,
                    capacity: 4,
                    seats: 4,
                    status: "available",
                    section: "indoor",
                    shape: "round",
                    positionX: 0,
                    positionY: 0,
                    width: 100,
                    height: 100,
                    activeOrder: null,
                  });
                }}
              >
                Add Table
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {Object.entries(sections).map(([section, sectionTables]) => (
          <div key={section} className="space-y-3">
            <h3 className="text-sm font-medium capitalize">{section} Section</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
              {sectionTables.map((table) => (
                <Card key={table.id} className="p-3">
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Table {table.number}</p>
                        <p className="text-xs text-muted-foreground">
                          Seats: {table.capacity}
                        </p>
                      </div>
                      <Select
                        value={table.status}
                        onValueChange={(value: TableLayout["status"]) =>
                          onUpdateStatus(table.id, value)
                        }
                      >
                        <SelectTrigger className="h-7 w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="occupied">Occupied</SelectItem>
                          <SelectItem value="reserved">Reserved</SelectItem>
                          <SelectItem value="cleaning">Cleaning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(table.status)}`}>
                        {table.status}
                      </span>
                      {table.status === "occupied" && !table.activeOrder && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7"
                          onClick={() => handleStartOrder(table.id)}
                        >
                          Start Order
                        </Button>
                      )}
                      {table.activeOrder && (
                        <span className="text-xs text-muted-foreground">
                          Order #{table.activeOrder}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
