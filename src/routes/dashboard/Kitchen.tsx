
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Clock, Users, ChefHat, Flame } from "lucide-react";
import { KitchenOrdersList } from "@/components/dashboard/kitchen/KitchenOrdersList";
import { useDashboardState } from "@/hooks/useDashboardState";
import type { KitchenOrder } from "@/types/staff";

const Kitchen = () => {
  const { 
    kitchenOrders, 
    isLoading, 
    updateKitchenOrderStatus, 
    updateOrderPriority,
    updateItemStatus,
    staff 
  } = useDashboardState();
  
  const [statusFilter, setStatusFilter] = useState<KitchenOrder["status"] | "all">("all");
  const [stationFilter, setStationFilter] = useState<string>("all");

  const activeStaff = staff?.filter(member => 
    member.status === "active" && member.role === "chef"
  ) || [];

  const getFilteredOrders = () => {
    return (kitchenOrders || []).filter(order => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesStation = stationFilter === "all" || order.items.some(
        item => item.cooking_station === stationFilter
      );
      return matchesStatus && matchesStation;
    });
  };

  const filteredOrders = getFilteredOrders();

  const calculateMetrics = () => {
    const orders = kitchenOrders || [];
    const completedOrders = orders.filter(order => order.status === "delivered").length;
    const pendingOrders = orders.filter(order => ["pending", "preparing"].includes(order.status)).length;
    const rushOrders = orders.filter(order => order.priority === "rush").length;
    
    let totalPrepTime = 0;
    let completedCount = 0;
    
    orders.forEach(order => {
      if (order.status === "delivered") {
        const start = new Date(order.created_at).getTime();
        const end = new Date(order.updated_at).getTime();
        totalPrepTime += end - start;
        completedCount++;
      }
    });

    const averagePrepTime = completedCount > 0 ? totalPrepTime / completedCount / 60000 : 0;

    return {
      completedOrders,
      pendingOrders,
      rushOrders,
      averagePrepTime: Math.round(averagePrepTime)
    };
  };

  const metrics = calculateMetrics();

  if (isLoading) {
    return <div className="p-8">Loading kitchen display...</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kitchen Display</h1>
          <p className="text-muted-foreground">Manage and track kitchen orders</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
              <h3 className="text-2xl font-bold">{metrics.pendingOrders}</h3>
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
              <p className="text-sm font-medium text-muted-foreground">Rush Orders</p>
              <h3 className="text-2xl font-bold">{metrics.rushOrders}</h3>
            </div>
            <Flame className="h-8 w-8 text-primary/20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Prep Time</p>
              <h3 className="text-2xl font-bold">{metrics.averagePrepTime} min</h3>
            </div>
            <ChefHat className="h-8 w-8 text-primary/20" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Orders Queue</h2>
          <div className="flex gap-4">
            <Select value={stationFilter} onValueChange={setStationFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by station" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stations</SelectItem>
                <SelectItem value="grill">Grill</SelectItem>
                <SelectItem value="fry">Fry</SelectItem>
                <SelectItem value="salad">Salad</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value: KitchenOrder["status"] | "all") => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <KitchenOrdersList
          orders={filteredOrders}
          onUpdateStatus={updateKitchenOrderStatus}
          onUpdatePriority={updateOrderPriority}
          onUpdateItemStatus={updateItemStatus}
        />
      </Card>
    </div>
  );
};

export default Kitchen;
