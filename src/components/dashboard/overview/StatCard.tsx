
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtext?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard = ({ icon: Icon, title, value, subtext, trend }: StatCardProps) => {
  return (
    <Card className="p-6 space-y-2 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-sage-100 dark:bg-sage-900 rounded-lg">
          <Icon className="h-6 w-6 text-sage-500 dark:text-sage-400" />
        </div>
        <h3 className="text-sm font-medium dark:text-white">{title}</h3>
      </div>
      <div className="text-2xl font-bold dark:text-white">{value}</div>
      {trend ? (
        <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.value}
        </div>
      ) : subtext ? (
        <div className="text-sm text-muted-foreground">{subtext}</div>
      ) : null}
    </Card>
  );
};
