
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Utensils, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  order_count: number;
  category: string;
}

export function MenuAnalytics() {
  const [topItems, setTopItems] = useState<MenuItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMenuAnalytics();
    subscribeToOrderUpdates();
  }, []);

  const subscribeToOrderUpdates = () => {
    const channel = supabase
      .channel('menu-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'menu_items'
        },
        () => {
          fetchMenuAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchMenuAnalytics = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('order_count', { ascending: false })
      .limit(5);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch menu analytics",
        variant: "destructive",
      });
      return;
    }

    setTopItems(data || []);
  };

  const calculateRevenue = (price: number, orderCount: number) => {
    return price * orderCount;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Menu Performance</h3>
        </div>
        <Badge variant="outline">Top 5 Items</Badge>
      </div>
      <div className="space-y-4">
        {topItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.name}</span>
                <Badge variant="secondary">{item.category}</Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{item.order_count} orders</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" />
                  <span>${calculateRevenue(item.price, item.order_count).toFixed(2)} revenue</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
