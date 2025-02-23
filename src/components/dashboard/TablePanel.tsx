
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TableLayout } from "@/types/staff";
import { useState } from "react";

interface TablePanelProps {
  tables: TableLayout[];
  onAddTable: (table: Omit<TableLayout, "id">) => void;
  onUpdateStatus: (tableId: number, status: TableLayout["status"]) => void;
}

export const TablePanel = ({
  tables,
  onAddTable,
  onUpdateStatus,
}: TablePanelProps) => {
  const [newTable, setNewTable] = useState<Omit<TableLayout, "id">>({
    number: 1,
    capacity: 4,
    status: "available",
    section: "indoor",
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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Table Layout</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Table</Button>
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
                    onChange={(e) => setNewTable({ ...newTable, number: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Capacity</label>
                  <Input
                    type="number"
                    value={newTable.capacity}
                    onChange={(e) => setNewTable({ ...newTable, capacity: Number(e.target.value) })}
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
                    onAddTable(newTable);
                    setNewTable({
                      number: tables.length + 1,
                      capacity: 4,
                      status: "available",
                      section: "indoor",
                    });
                  }}
                >
                  Add Table
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-8">
          {Object.entries(sections).map(([section, sectionTables]) => (
            <div key={section}>
              <h3 className="text-md font-medium mb-4 capitalize">{section} Section</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sectionTables.map((table) => (
                  <Card key={table.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Table {table.number}</h3>
                        <p className="text-sm text-muted-foreground">
                          Capacity: {table.capacity}
                        </p>
                      </div>
                      <Select
                        value={table.status}
                        onValueChange={(value: TableLayout["status"]) =>
                          onUpdateStatus(table.id, value)
                        }
                      >
                        <SelectTrigger className="w-32">
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
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(table.status)}`}>
                        {table.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
