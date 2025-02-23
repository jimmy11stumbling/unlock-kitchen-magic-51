
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

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Table Management</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <Card key={table.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Table {table.number}</h3>
                <p className="text-sm text-muted-foreground">
                  Capacity: {table.capacity} | Section: {table.section}
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
          </Card>
        ))}
      </div>
    </Card>
  );
};
