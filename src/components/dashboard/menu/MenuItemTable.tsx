
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { MenuItem } from "@/types/staff";

interface MenuItemTableProps {
  items: MenuItem[];
  onUpdateAvailability: (itemId: number, available: boolean) => void;
  onUpdateMenuItem?: (itemId: number, item: Partial<MenuItem>) => void;
  onDeleteMenuItem?: (itemId: number) => void;
}

export const MenuItemTable = ({
  items,
  onUpdateAvailability,
  onUpdateMenuItem,
  onDeleteMenuItem,
}: MenuItemTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>${item.price.toFixed(2)}</TableCell>
            <TableCell>
              <Switch
                checked={item.available}
                onCheckedChange={(checked) => onUpdateAvailability(item.id, checked)}
              />
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onUpdateMenuItem?.(item.id, item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDeleteMenuItem?.(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
