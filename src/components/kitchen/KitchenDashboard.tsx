
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KitchenOrderCard } from "../dashboard/kitchen/KitchenOrderCard";
import { useKitchenState } from "@/hooks/dashboard/useKitchenState";
import type { KitchenOrder } from "@/types/staff";

export const KitchenDashboard = () => {
  const { kitchenOrders, loading, updateOrderStatus, updateItemStatus } = useKitchenState();
  const [filterStatus, setFilterStatus] = useState<KitchenOrder['status'] | 'all'>('all');

  const filteredOrders = kitchenOrders.filter(order => 
    filterStatus === 'all' ? true : order.status === filterStatus
  );

  return (
    <div className="container mx-auto p-4 max-w-[1920px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
        <Select value={filterStatus} onValueChange={(value: typeof filterStatus) => setFilterStatus(value)}>
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

      {loading ? (
        <Card className="p-8">
          <p className="text-center">Loading kitchen orders...</p>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="p-8">
          <p className="text-center">No orders matching the selected filter</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredOrders.map(order => (
            <KitchenOrderCard
              key={order.id}
              order={order}
              onUpdateStatus={updateOrderStatus}
              onUpdateItemStatus={updateItemStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};
