
import { ShoppingCart, DollarSign, BarChart } from "lucide-react";
import { Card } from "@/components/ui/card";

interface OrderMetricsProps {
  metrics: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
}

export function OrderMetrics({ metrics }: OrderMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <h3 className="text-2xl font-bold">{metrics.totalOrders}</h3>
          </div>
          <ShoppingCart className="h-8 w-8 text-primary/20" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <h3 className="text-2xl font-bold">${metrics.totalRevenue.toFixed(2)}</h3>
          </div>
          <DollarSign className="h-8 w-8 text-primary/20" />
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Average Order Value</p>
            <h3 className="text-2xl font-bold">${metrics.avgOrderValue.toFixed(2)}</h3>
          </div>
          <BarChart className="h-8 w-8 text-primary/20" />
        </div>
      </Card>
    </div>
  );
}
