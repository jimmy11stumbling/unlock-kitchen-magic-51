import { useState, useEffect, useMemo } from "react";
import { KitchenLayout } from "@/components/dashboard/kitchen/KitchenLayout";
import { EquipmentMonitor } from "@/components/dashboard/kitchen/EquipmentMonitor";
import { KitchenOrderCard } from "@/components/dashboard/kitchen/KitchenOrderCard";
import { QualityControl } from "@/components/dashboard/kitchen/QualityControl";
import { TemperatureMonitor } from "@/components/dashboard/kitchen/TemperatureMonitor";
import { InventoryTracker } from "@/components/dashboard/kitchen/InventoryTracker";
import { useKitchenState } from "@/hooks/dashboard/useKitchenState";
import { KitchenNotifications } from "@/components/dashboard/kitchen/KitchenNotifications";
import { KitchenAnalytics } from "@/components/dashboard/kitchen/KitchenAnalytics";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";

export function KitchenDashboard() {
  const { 
    kitchenOrders,
    updateKitchenOrderStatus,
    updateOrderPriority,
    updateItemStatus 
  } = useKitchenState();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.preload = 'auto';
    
    audio.load();
    
    return () => {
      audio.remove();
    };
  }, []);

  const filteredOrders = useMemo(() => {
    if (!kitchenOrders) return [];
    
    return kitchenOrders.filter(order => {
      const matchesSearch = 
        order.order_id.toString().includes(searchTerm) ||
        (order.tableNumber?.toString() || '').includes(searchTerm) ||
        (order.serverName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [kitchenOrders, searchTerm, statusFilter, priorityFilter]);

  const activeOrders = useMemo(() => {
    return kitchenOrders?.filter(order => order.status === 'preparing' || order.status === 'pending') || [];
  }, [kitchenOrders]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
        <div className="flex items-center gap-4">
          <KitchenNotifications activeOrders={activeOrders} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label>Search Orders</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order #, table, or server"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="preparing">Preparing</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="rush">Rush</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">
                Active Orders ({activeOrders.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                All Orders ({kitchenOrders?.length || 0})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4 mt-4">
              {activeOrders.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">No active orders at this time</p>
                </div>
              ) : (
                activeOrders.map(order => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateKitchenOrderStatus}
                    onUpdatePriority={updateOrderPriority}
                    onUpdateItemStatus={updateItemStatus}
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="all" className="space-y-4 mt-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <p className="text-muted-foreground">No orders match your filters</p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateKitchenOrderStatus}
                    onUpdatePriority={updateOrderPriority}
                    onUpdateItemStatus={updateItemStatus}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <KitchenAnalytics orders={kitchenOrders || []} />
          <KitchenLayout orders={activeOrders} />
          <EquipmentMonitor />
          <QualityControl />
          <TemperatureMonitor stationId="main-kitchen" />
        </div>
      </div>
    </div>
  );
}
