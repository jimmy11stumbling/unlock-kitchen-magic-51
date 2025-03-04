import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { TableData, TableStatus } from "@/types/staff";

interface TableLayoutProps {
  table: TableData;
  onUpdateStatus: (tableId: number, status: TableStatus) => void;
}

const getStatusColor = (status: TableStatus) => {
  switch (status) {
    case "available": return "bg-green-100 text-green-800";
    case "occupied": return "bg-red-100 text-red-800";
    case "reserved": return "bg-yellow-100 text-yellow-800";
    case "dirty": return "bg-gray-100 text-gray-800";
    case "maintenance": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getOrderStatusLabel = (status) => {
  if (status === "pending" || status === "preparing") return "In Progress";
  if (status === "ready" || status === "delivered" || status === "completed") return "Ready";
  if (status === "cancelled") return "Cancelled";
  return status;
};

const TableLayout = ({ table, onUpdateStatus }: TableLayoutProps) => {
  const handleStatusChange = (tableId: number, status: TableStatus) => {
    onUpdateStatus(tableId, status);
  };

  const renderReservationInfo = (table) => {
    if (table.reservation) {
      return (
        <div className="mt-2 text-xs">
          <p>Reserved for: {table.reservation.customerName}</p>
          <p>Time: {table.reservation.time}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Table {table.number}</CardTitle>
        <CardDescription>
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${getStatusColor(table.status)}`}>
              {table.status}
            </Badge>
            {table.orders && table.orders.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {table.orders.length} Active Orders
              </Badge>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Table" />
              <AvatarFallback>T</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">Capacity: {table.capacity}</p>
              <p className="text-sm text-muted-foreground">Section: {table.section}</p>
            </div>
          </div>

          {table.orders && table.orders.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Active Orders:</h4>
              {table.orders.map((order) => (
                <div key={order.id} className="border rounded-md p-2">
                  <p className="text-xs">Order ID: {order.id}</p>
                  <p className="text-xs">Status: {getOrderStatusLabel(order.status)}</p>
                  <p className="text-xs">Total: ${order.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active orders.</p>
          )}

          {renderReservationInfo(table)}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleStatusChange(table.id, "available")}>
              Mark as Available
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(table.id, "occupied")}>
              Mark as Occupied
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(table.id, "reserved")}>
              Mark as Reserved
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(table.id, "dirty")}>
              Mark as Dirty
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(table.id, "maintenance")}>
              Mark as Maintenance
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>
                  Remove Table
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the table
                    and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default TableLayout;
