
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Clock, Users, ChefHat } from "lucide-react";
import { KitchenOrdersList } from "@/components/dashboard/kitchen/KitchenOrdersList";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useToast } from "@/components/ui/use-toast";

const Kitchen = () => {
  const { kitchenOrders, updateKitchenOrderStatus, staff } = useDashboardState();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const activeStaff = staff.filter(member => 
    member.status === "active" && member.role === "kitchen_staff"
  );

  const filteredOrders = kitchenOrders.filter(order => 
    statusFilter === "all" || order.status === statusFilter
  );

  const averagePreparationTime = kitchenOrders
    .filter(order => order.status === "completed")
    .reduce((acc, order) => {
      const start = new Date(order.created_at).getTime();
      const end = new Date(order.updated_at).getTime();
      return acc + (end - start);
    }, 0) / (kitchenOrders.filter(order => order.status === "completed").length || 1);

  const handleStatusUpdate = (orderId: number, status: string) => {
    updateKitchenOrderStatus(orderId, status);
    toast({
      title: "Order Status Updated",
      description: `Order #${orderId} has been marked as ${status}`,
    });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kitchen Display</h1>
          <p className="text-muted-foreground">Manage and track kitchen orders</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
              <h3 className="text-2xl font-bold">
                {kitchenOrders.filter(o => ["pending", "in_progress"].includes(o.status)).length}
              </h3>
            </div>
            <Clock className="h-8 w-8 text-primary/20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Kitchen Staff</p>
              <h3 className="text-2xl font-bold">{activeStaff.length}</h3>
            </div>
            <Users className="h-8 w-8 text-primary/20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Prep Time</p>
              <h3 className="text-2xl font-bold">
                {Math.round(averagePreparationTime / 60000)} min
              </h3>
            </div>
            <ChefHat className="h-8 w-8 text-primary/20" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Orders Queue</h2>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <KitchenOrdersList
          orders={filteredOrders}
          onUpdateStatus={handleStatusUpdate}
        />
      </Card>
    </div>
  );
};

export default Kitchen;
