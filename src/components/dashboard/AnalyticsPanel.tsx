
import { Card } from "@/components/ui/card";
import type { SalesData } from "@/types/staff";

interface AnalyticsPanelProps {
  salesData: SalesData[];
}

export const AnalyticsPanel = ({ salesData }: AnalyticsPanelProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Sales Analytics</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {salesData.map((data, index) => (
          <Card key={index} className="p-4">
            <h3 className="text-sm font-medium">{data.date}</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-medium text-green-600">
                  ${data.revenue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Costs</span>
                <span className="font-medium text-red-600">
                  ${data.costs.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Profit</span>
                <span className="font-medium text-blue-600">
                  ${data.profit.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};
