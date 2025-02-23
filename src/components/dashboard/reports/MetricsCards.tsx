
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Users,
  Clock,
  BarChart3,
  Activity,
  Percent
} from "lucide-react";

interface MetricsCardsProps {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalProfit: number;
    profitMargin: number;
    laborCostRatio: number;
    inventoryCostRatio: number;
    averageDailyRevenue: number;
  } | null;
}

export const MetricsCards = ({ metrics }: MetricsCardsProps) => {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">${metrics.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Net Profit</p>
            <p className="text-2xl font-bold">${metrics.totalProfit.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Percent className="w-8 h-8 text-purple-500" />
          <div>
            <p className="text-sm text-muted-foreground">Profit Margin</p>
            <p className="text-2xl font-bold">{metrics.profitMargin.toFixed(1)}%</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-sm text-muted-foreground">Avg Daily Revenue</p>
            <p className="text-2xl font-bold">${metrics.averageDailyRevenue.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-8 h-8 text-indigo-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{metrics.totalOrders}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-8 h-8 text-pink-500" />
          <div>
            <p className="text-sm text-muted-foreground">Avg Order Value</p>
            <p className="text-2xl font-bold">${metrics.averageOrderValue.toFixed(2)}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Users className="w-8 h-8 text-red-500" />
          <div>
            <p className="text-sm text-muted-foreground">Labor Cost Ratio</p>
            <p className="text-2xl font-bold">{metrics.laborCostRatio.toFixed(1)}%</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-8 h-8 text-orange-500" />
          <div>
            <p className="text-sm text-muted-foreground">Inventory Cost</p>
            <p className="text-2xl font-bold">{metrics.inventoryCostRatio.toFixed(1)}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
