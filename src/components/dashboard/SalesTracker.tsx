
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SalesData {
  time: string;
  amount: number;
}

export function SalesTracker() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [growth, setGrowth] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    fetchSalesData();
    subscribeToOrders();
  }, []);

  const subscribeToOrders = () => {
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchSalesData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchSalesData = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('orders')
      .select('total, created_at')
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch sales data",
        variant: "destructive",
      });
      return;
    }

    const hourlyData = processHourlySales(data || []);
    setSalesData(hourlyData);
    calculateTotals(data || []);
  };

  const processHourlySales = (orders: any[]) => {
    const hourlyMap = new Map<string, number>();
    
    orders.forEach(order => {
      const hour = new Date(order.created_at).getHours();
      const timeKey = `${hour}:00`;
      const current = hourlyMap.get(timeKey) || 0;
      hourlyMap.set(timeKey, current + (order.total || 0));
    });

    return Array.from(hourlyMap.entries())
      .map(([time, amount]) => ({ time, amount }))
      .sort((a, b) => parseInt(a.time) - parseInt(b.time));
  };

  const calculateTotals = (orders: any[]) => {
    const total = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    setTodayTotal(total);

    // Calculate growth compared to average of last 7 days
    calculateGrowth();
  };

  const calculateGrowth = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: previousData } = await supabase
      .from('orders')
      .select('total, created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
      .lt('created_at', new Date().toISOString());

    if (previousData) {
      const avgDaily = previousData.reduce((sum, order) => sum + (order.total || 0), 0) / 7;
      const growthRate = ((todayTotal - avgDaily) / avgDaily) * 100;
      setGrowth(growthRate);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Today's Sales</h3>
          <div className="flex items-center gap-2 mt-1">
            <DollarSign className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold">${todayTotal.toFixed(2)}</span>
          </div>
        </div>
        <Badge 
          variant={growth >= 0 ? "success" : "destructive"}
          className="flex items-center gap-1"
        >
          <TrendingUp className="h-4 w-4" />
          {growth > 0 ? "+" : ""}{growth.toFixed(1)}%
        </Badge>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#22c55e"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
