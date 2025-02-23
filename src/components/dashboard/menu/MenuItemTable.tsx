
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Image, Trash2 } from "lucide-react";
import type { MenuItem } from "@/types/staff";

interface MenuItemTableProps {
  items: MenuItem[];
  onUpdateAvailability: (itemId: number, available: boolean) => void;
  onUpdatePrice: (itemId: number, price: number) => void;
  onEdit: (item: MenuItem) => void;
  onDelete?: (itemId: number) => void;
}

export const MenuItemTable = ({
  items,
  onUpdateAvailability,
  onUpdatePrice,
  onEdit,
  onDelete,
}: MenuItemTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Prep Time</TableHead>
          <TableHead>Allergens</TableHead>
          <TableHead>Available</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                  <Image className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell className="capitalize">{item.category}</TableCell>
            <TableCell>
              <Input
                type="number"
                value={item.price}
                onChange={(e) => onUpdatePrice(item.id, Number(e.target.value))}
                className="w-24"
              />
            </TableCell>
            <TableCell>{item.preparationTime} min</TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">
                {item.allergens.join(", ")}
              </span>
            </TableCell>
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
                  onClick={() => onEdit(item)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                {onDelete && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
