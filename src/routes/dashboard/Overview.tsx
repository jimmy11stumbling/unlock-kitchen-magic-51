import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  AlertTriangle,
  ChefHat,
  ShoppingBag
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { 
  mockOrders, 
  mockStaffData, 
  mockInventoryData, 
  generateMockSalesData 
} from '@/hooks/dashboard/analytics/data/mockDashboardData';

import { Announcements } from "@/components/dashboard/Announcements";
import { SalesTracker } from "@/components/dashboard/SalesTracker";
import { KitchenStatus } from "@/components/dashboard/KitchenStatus";
import { StaffPerformance } from "@/components/dashboard/StaffPerformance";
import { InventoryStatus } from "@/components/dashboard/InventoryStatus";
import { MenuAnalytics } from "@/components/dashboard/MenuAnalytics";

interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  avgPrepTime: number;
  activeStaff: number;
  pendingOrders: number;
  customerSatisfaction: number;
  inventoryAlerts: number;
  topSellingItems: Array<{name: string, quantity: number}>;
  averageOrderValue: number;
  peakHours: Array<{hour: number, orders: number}>;
  staffEfficiency: number;
  revenueGrowth: number;
  mostProfitableItems: Array<{name: string, revenue: number}>;
}

export default function Overview() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOrders: 0,
    totalRevenue: 0,
    avgPrepTime: 0,
    activeStaff: 0,
    pendingOrders: 0,
    customerSatisfaction: 0,
    inventoryAlerts: 0,
    topSellingItems: [],
    averageOrderValue: 0,
    peakHours: [],
    staffEfficiency: 0,
    revenueGrowth: 0,
    mostProfitableItems: []
  });
  const [salesData, setSalesData] = useState([]);
  const [timeFrame, setTimeFrame] = useState("today");
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
    
    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [timeFrame]);

  const fetchDashboardData = async () => {
    try {
      const ordersData = mockOrders;
      const staffData = mockStaffData;
      const inventoryData = mockInventoryData;

      const calculatedMetrics = {
        totalOrders: ordersData.length,
        totalRevenue: calculateTotalRevenue(ordersData),
        avgPrepTime: calculateAveragePrepTime(ordersData),
        activeStaff: staffData.length,
        pendingOrders: ordersData.filter(order => order.status === 'pending').length,
        customerSatisfaction: calculateCustomerSatisfaction(ordersData),
        inventoryAlerts: calculateInventoryAlerts(inventoryData),
        topSellingItems: calculateTopSellingItems(ordersData),
        averageOrderValue: calculateAverageOrderValue(ordersData),
        peakHours: calculatePeakHours(ordersData),
        staffEfficiency: calculateStaffEfficiency(ordersData, staffData),
        revenueGrowth: calculateRevenueGrowth(ordersData),
        mostProfitableItems: calculateMostProfitableItems(ordersData)
      };

      setMetrics(calculatedMetrics);
      setSalesData(generateSalesData(ordersData));

      console.log('Enhanced Dashboard Metrics:', calculatedMetrics);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    }
  };

  const calculateTotalRevenue = (orders: any[]) => {
    return orders.reduce((sum, order) => {
      if (order.status !== 'cancelled') {
        return sum + (order.total || 0);
      }
      return sum;
    }, 0);
  };

  const calculateAverageOrderValue = (orders: any[]) => {
    if (orders.length === 0) return 0;
    const completedOrders = orders.filter(order => order.status !== 'cancelled');
    return completedOrders.reduce((sum, order) => sum + order.total, 0) / completedOrders.length;
  };

  const calculatePeakHours = (orders: any[]) => {
    const hourCounts = new Array(24).fill(0);
    orders.forEach(order => {
      const hour = new Date(order.created_at).getHours();
      hourCounts[hour]++;
    });
    
    return hourCounts
      .map((count, hour) => ({ hour, orders: count }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);
  };

  const calculateStaffEfficiency = (orders: any[], staff: any[]) => {
    if (staff.length === 0 || orders.length === 0) return 0;
    
    const completedOrders = orders.filter(order => order.status === 'delivered');
    const avgOrdersPerStaff = completedOrders.length / staff.length;
    const targetOrdersPerStaff = 10; // Configurable target
    
    return Math.min((avgOrdersPerStaff / targetOrdersPerStaff) * 100, 100);
  };

  const calculateRevenueGrowth = (orders: any[]) => {
    if (orders.length === 0) return 0;
    
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const currentMonthOrders = orders.filter(order => 
      new Date(order.created_at) >= lastMonth
    );
    
    const previousMonthOrders = orders.filter(order => 
      new Date(order.created_at) < lastMonth && 
      new Date(order.created_at) >= new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, 1)
    );
    
    const currentRevenue = currentMonthOrders.reduce((sum, order) => sum + order.total, 0);
    const previousRevenue = previousMonthOrders.reduce((sum, order) => sum + order.total, 0);
    
    return previousRevenue === 0 ? 100 : 
      ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  };

  const calculateMostProfitableItems = (orders: any[]) => {
    const itemRevenue = new Map();
    
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const currentRevenue = itemRevenue.get(item.name) || 0;
        itemRevenue.set(item.name, currentRevenue + (item.price * item.quantity));
      });
    });
    
    return Array.from(itemRevenue.entries())
      .map(([name, revenue]) => ({ name, revenue: Number(revenue.toFixed(2)) }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const calculateInventoryAlerts = (inventory: any[]) => {
    return inventory.filter(item => 
      item.current_stock <= item.minimum_stock
    ).length;
  };

  const calculateAveragePrepTime = (orders: any[]) => {
    const completedOrders = orders.filter(order => order.status === 'delivered');
    if (completedOrders.length === 0) return 0;
    
    const totalPrepTime = completedOrders.reduce((sum, order) => {
      const start = new Date(order.created_at).getTime();
      const end = new Date(order.updated_at).getTime();
      return sum + (end - start);
    }, 0);
    
    return Math.round(totalPrepTime / (completedOrders.length * 60000)); // Convert to minutes
  };

  const calculateCustomerSatisfaction = (orders: any[]) => {
    const completedOrders = orders.filter(order => order.status === 'delivered');
    if (completedOrders.length === 0) return 0;
    
    const onTimeDeliveries = completedOrders.filter(order => {
      const deliveryTime = new Date(order.updated_at).getTime();
      const estimatedTime = new Date(order.estimated_prep_time).getTime();
      return deliveryTime <= estimatedTime;
    });
    
    return Math.round((onTimeDeliveries.length / completedOrders.length) * 100);
  };

  const calculateTopSellingItems = (orders: any[]) => {
    const itemCounts = new Map();
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const count = itemCounts.get(item.name) || 0;
        itemCounts.set(item.name, count + item.quantity);
      });
    });
    
    return Array.from(itemCounts.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  const generateSalesData = (orders: any[]) => {
    const timeFrameMap = {
      today: 24,
      week: 7,
      month: 30
    };
    
    const periods = timeFrameMap[timeFrame as keyof typeof timeFrameMap];
    const data = [];
    
    for (let i = 0; i < periods; i++) {
      const value = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        const now = new Date();
        if (timeFrame === 'today') {
          return orderDate.getHours() === i;
        } else if (timeFrame === 'week') {
          const dayDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
          return dayDiff === i;
        }
        return true;
      }).reduce((sum, order) => sum + order.total, 0);
      
      data.push({
        name: timeFrame === 'today' ? `${i}:00` : `Day ${i + 1}`,
        value
      });
    }
    
    return data;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <Tabs value={timeFrame} onValueChange={setTimeFrame}>
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Announcements />

      <div className="grid gap-6 md:grid-cols-2">
        <SalesTracker />
        <KitchenStatus />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <StaffPerformance />
        <InventoryStatus />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MenuAnalytics />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <h3 className="text-2xl font-bold">{metrics.totalOrders}</h3>
            </div>
            <ShoppingBag className="h-8 w-8 text-primary/20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Revenue</p>
              <h3 className="text-2xl font-bold">${metrics.totalRevenue.toFixed(2)}</h3>
            </div>
            <DollarSign className="h-8 w-8 text-primary/20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Staff</p>
              <h3 className="text-2xl font-bold">{metrics.activeStaff}</h3>
            </div>
            <ChefHat className="h-8 w-8 text-primary/20" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Prep Time</p>
              <h3 className="text-2xl font-bold">{metrics.avgPrepTime} min</h3>
            </div>
            <Clock className="h-8 w-8 text-primary/20" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
              <h3 className="text-2xl font-bold">${metrics.averageOrderValue.toFixed(2)}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-primary/20" />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Sales Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Most Profitable Items</h3>
          <div className="space-y-4">
            {metrics.mostProfitableItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
                  <span>{item.name}</span>
                </div>
                <Badge variant="secondary">${item.revenue}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Pending Orders</h3>
            <Badge variant="secondary">{metrics.pendingOrders}</Badge>
          </div>
          {metrics.pendingOrders > 0 && (
            <div className="text-sm text-muted-foreground">
              {metrics.pendingOrders} orders waiting to be processed
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Customer Satisfaction</h3>
            <Badge 
              variant={metrics.customerSatisfaction >= 90 ? "success" : "secondary"}
            >
              {metrics.customerSatisfaction}%
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Based on delivery time performance
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Inventory Alerts</h3>
            <Badge 
              variant={metrics.inventoryAlerts > 0 ? "destructive" : "secondary"}
            >
              {metrics.inventoryAlerts}
            </Badge>
          </div>
          {metrics.inventoryAlerts > 0 && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span>{metrics.inventoryAlerts} items below minimum stock</span>
            </div>
          )}
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Staff Efficiency</h3>
            <Badge 
              variant={metrics.staffEfficiency >= 80 ? "success" : "secondary"}
            >
              {Math.round(metrics.staffEfficiency)}%
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Based on orders processed per staff member
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Revenue Growth</h3>
            <Badge 
              variant={metrics.revenueGrowth > 0 ? "success" : "destructive"}
            >
              {metrics.revenueGrowth > 0 ? '+' : ''}{Math.round(metrics.revenueGrowth)}%
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Compared to last month
          </div>
        </Card>
      </div>
    </div>
  );
}
