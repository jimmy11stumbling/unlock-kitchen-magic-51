
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Database types that match the actual schema
type DbStaffMember = {
  id: number;
  name: string;
  performance_rating: number;
  role: string;
};

type DbKitchenOrder = {
  id: number;
  coursing: string;
  created_at: string;
  updated_at: string;
  estimated_delivery_time: string;
  items: unknown;
  notes: string | null;
  order_id: number | null;
  priority: string;
  server_name: string | null;
  status: string;
  table_number: number | null;
};

// Simplified metrics types
type OrderMetrics = {
  completed: number;
  avgPrepTime: number;
  onTimeRate: number;
};

type StaffMetrics = {
  id: number;
  name: string;
  ordersCompleted: number;
  averagePreparationTime: number;
  onTimeDeliveryRate: number;
  qualityRating: number;
};

export function StaffPerformanceTracker() {
  const [staffMetrics, setStaffMetrics] = useState<StaffMetrics[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    void fetchStaffMetrics();
    const interval = setInterval(() => void fetchStaffMetrics(), 300000);
    return () => clearInterval(interval);
  }, []);

  const calculateOrderMetrics = (orders: DbKitchenOrder[]): OrderMetrics => {
    const completedOrders = orders.filter(order => order.status === 'delivered');
    const onTimeOrders = completedOrders.filter(order => {
      const completionTime = new Date(order.updated_at);
      const estimatedTime = new Date(order.estimated_delivery_time);
      return completionTime <= estimatedTime;
    });

    const totalTime = completedOrders.reduce((acc, curr) => {
      const start = new Date(curr.created_at);
      const end = new Date(curr.updated_at);
      return acc + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);

    return {
      completed: completedOrders.length,
      avgPrepTime: completedOrders.length ? totalTime / completedOrders.length : 0,
      onTimeRate: completedOrders.length ? (onTimeOrders.length / completedOrders.length) * 100 : 100
    };
  };

  const fetchStaffMetrics = async () => {
    try {
      // Fetch chefs data with type safety
      const chefResult = await supabase
        .from('staff_members')
        .select()
        .eq('role', 'chef');

      if (chefResult.error) throw chefResult.error;
      
      const chefs = chefResult.data as unknown as DbStaffMember[];
      if (!chefs?.length) return;

      // Process each chef's orders
      const metrics = await Promise.all(
        chefs.map(async (chef) => {
          const ordersResult = await supabase
            .from('kitchen_orders')
            .select()
            .eq('assigned_chef', chef.id);

          const orders = (ordersResult.data || []) as unknown as DbKitchenOrder[];
          const orderMetrics = calculateOrderMetrics(orders);

          return {
            id: chef.id,
            name: chef.name,
            ordersCompleted: orderMetrics.completed,
            averagePreparationTime: orderMetrics.avgPrepTime,
            onTimeDeliveryRate: orderMetrics.onTimeRate,
            qualityRating: chef.performance_rating || 0
          } as StaffMetrics;
        })
      );

      setStaffMetrics(metrics);

    } catch (error) {
      console.error('Error fetching staff metrics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch staff performance metrics",
        variant: "destructive",
      });
    }
  };

  const getPerformanceStatus = (metric: number): "success" | "destructive" | "secondary" => {
    if (metric >= 90) return 'success';
    if (metric >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Staff Performance</h3>
      </div>

      <div className="space-y-4">
        {staffMetrics.map((staff) => (
          <Card key={staff.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{staff.name}</h4>
              <Badge variant={getPerformanceStatus(staff.onTimeDeliveryRate)}>
                {Math.round(staff.onTimeDeliveryRate)}% On Time
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Orders Completed</p>
                <p className="font-medium">{staff.ordersCompleted}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Prep Time</p>
                <p className="font-medium">{Math.round(staff.averagePreparationTime)} min</p>
              </div>
              <div>
                <p className="text-muted-foreground">Quality Rating</p>
                <p className="font-medium">{staff.qualityRating}/10</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
