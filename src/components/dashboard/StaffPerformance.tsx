import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Users, Star, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StaffMetrics {
  id: number;
  name: string;
  ordersCompleted: number;
  averageOrderTime: number;
  customerRating: number;
  status: string;
}

export function StaffPerformance() {
  const [staffMetrics, setStaffMetrics] = useState<StaffMetrics[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchStaffMetrics();
    subscribeToStaffUpdates();
  }, []);

  const subscribeToStaffUpdates = () => {
    const channel = supabase
      .channel('staff-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'staff_members'
        },
        () => {
          fetchStaffMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchStaffMetrics = async () => {
    const { data: staffData, error } = await supabase
      .from('staff_members')
      .select(`
        id,
        name,
        status,
        performance_rating
      `)
      .eq('status', 'active');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch staff metrics",
        variant: "destructive",
      });
      return;
    }

    const transformedData: StaffMetrics[] = (staffData || []).map(staff => ({
      id: staff.id,
      name: staff.name,
      ordersCompleted: 0,
      averageOrderTime: 0,
      customerRating: staff.performance_rating || 0,
      status: staff.status
    }));

    setStaffMetrics(transformedData);
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 3.5) return "text-blue-500";
    if (rating >= 2.5) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Staff Performance</h3>
        </div>
        <Badge variant="outline">
          {staffMetrics.length} Active Staff
        </Badge>
      </div>
      <div className="space-y-4">
        {staffMetrics.map((staff) => (
          <div
            key={staff.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{staff.name}</span>
                <div className="flex items-center gap-1">
                  <Star className={`h-4 w-4 ${getPerformanceColor(staff.customerRating)}`} />
                  <span className="text-sm">{staff.customerRating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{staff.ordersCompleted} orders</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{staff.averageOrderTime} min avg</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
