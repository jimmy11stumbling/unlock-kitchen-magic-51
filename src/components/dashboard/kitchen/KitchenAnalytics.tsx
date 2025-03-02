
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Clock, ChefHat, AlertCircle } from "lucide-react";
import type { KitchenOrder } from "@/types/staff";

interface KitchenAnalyticsProps {
  orders: KitchenOrder[];
}

export function KitchenAnalytics({ orders }: KitchenAnalyticsProps) {
  const stats = useMemo(() => {
    if (!orders.length) return null;

    // Calculate average preparation time
    const completedOrders = orders.filter(order => order.status === 'ready' || order.status === 'delivered');
    let avgPrepTime = 0;
    
    if (completedOrders.length > 0) {
      const totalPrepTime = completedOrders.reduce((sum, order) => {
        const startTime = new Date(order.created_at).getTime();
        const endTime = new Date(order.updated_at).getTime();
        return sum + (endTime - startTime);
      }, 0);
      
      avgPrepTime = totalPrepTime / completedOrders.length / 60000; // convert to minutes
    }

    // Calculate station utilization
    const stationLoads = {
      grill: 0,
      fry: 0,
      salad: 0,
      dessert: 0,
      beverage: 0,
    };

    orders.forEach(order => {
      order.items.forEach(item => {
        const station = item.cooking_station || 'other';
        if (station in stationLoads) {
          stationLoads[station as keyof typeof stationLoads] += 1;
        }
      });
    });

    // Calculate order status distribution
    const statusCounts = {
      pending: orders.filter(order => order.status === 'pending').length,
      preparing: orders.filter(order => order.status === 'preparing').length,
      ready: orders.filter(order => order.status === 'ready').length,
      delivered: orders.filter(order => order.status === 'delivered').length,
    };

    return {
      totalActiveOrders: orders.filter(order => order.status === 'pending' || order.status === 'preparing').length,
      avgPrepTime,
      stationLoads,
      statusCounts,
      rushOrders: orders.filter(order => order.priority === 'rush').length,
    };
  }, [orders]);

  const stationData = useMemo(() => {
    if (!stats) return [];
    
    return Object.entries(stats.stationLoads).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [stats]);

  const statusData = useMemo(() => {
    if (!stats) return [];
    
    return Object.entries(stats.statusCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [stats]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (!stats) {
    return (
      <Card className="p-6">
        <div className="text-center py-8 text-muted-foreground">
          No order data available for analytics
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-6">Kitchen Performance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-lg">
          <Clock className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Avg. Prep Time</p>
            <p className="text-xl font-semibold">{stats.avgPrepTime.toFixed(1)} min</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-lg">
          <ChefHat className="h-6 w-6 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Active Orders</p>
            <p className="text-xl font-semibold">{stats.totalActiveOrders}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-lg">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <div>
            <p className="text-sm text-muted-foreground">Rush Orders</p>
            <p className="text-xl font-semibold">{stats.rushOrders}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3 text-sm">Station Workload</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stationData}
                margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-3 text-sm">Order Status</h4>
          <div className="h-48 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => 
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}
