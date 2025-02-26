
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Simple, flat types without nesting to avoid type instantiation depth issues
type DbStaffMember = {
  id: number;
  name: string;
  performance_rating: number;
  role: string;
};

type SimpleKitchenOrder = {
  id: number;
  status: string;
  created_at: string;
  updated_at: string;
  estimated_delivery_time: string;
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

  // Simplified calculation function with basic types
  const calculateMetrics = (orders: SimpleKitchenOrder[]) => {
    const completed = orders.filter(order => order.status === 'delivered');
    const onTime = completed.filter(order => {
      return new Date(order.updated_at) <= new Date(order.estimated_delivery_time);
    });

    const totalMinutes = completed.reduce((acc, curr) => {
      const start = new Date(curr.created_at).getTime();
      const end = new Date(curr.updated_at).getTime();
      return acc + (end - start) / (1000 * 60);
    }, 0);

    return {
      completed: completed.length,
      avgPrepTime: completed.length ? totalMinutes / completed.length : 0,
      onTimeRate: completed.length ? (onTime.length / completed.length) * 100 : 100
    };
  };

  const fetchStaffMetrics = async () => {
    try {
      const { data: chefs, error: staffError } = await supabase
        .from('staff_members')
        .select('id, name, performance_rating, role')
        .eq('role', 'chef');

      if (staffError) throw staffError;
      if (!chefs || chefs.length === 0) return;

      // Process chefs sequentially to avoid Promise.all type depth issues
      const metrics: StaffMetrics[] = [];

      for (const chef of chefs) {
        const { data: orders } = await supabase
          .from('kitchen_orders')
          .select('id, status, created_at, updated_at, estimated_delivery_time')
          .eq('assigned_chef', chef.id);

        // Calculate metrics with simplified order type
        const orderMetrics = calculateMetrics(orders as SimpleKitchenOrder[] || []);

        metrics.push({
          id: chef.id,
          name: chef.name,
          ordersCompleted: orderMetrics.completed,
          averagePreparationTime: orderMetrics.avgPrepTime,
          onTimeDeliveryRate: orderMetrics.onTimeRate,
          qualityRating: chef.performance_rating || 0
        });
      }

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
