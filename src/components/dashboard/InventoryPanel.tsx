
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Box, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { InventoryItem } from "@/types/staff";

interface InventoryPanelProps {
  inventory: InventoryItem[];
}

export const InventoryPanel = ({ inventory }: InventoryPanelProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Inventory Control</h2>
        <Button onClick={() => {
          // Add inventory item dialog
        }}>
          <Box className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Min. Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{item.minQuantity}</TableCell>
              <TableCell>${item.price}</TableCell>
              <TableCell>
                {item.quantity < item.minQuantity ? (
                  <span className="text-red-500 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Low Stock
                  </span>
                ) : (
                  <span className="text-green-500 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    In Stock
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
