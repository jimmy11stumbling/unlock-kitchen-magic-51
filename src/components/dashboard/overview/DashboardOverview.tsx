
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";
import { RecentActivity } from "./RecentActivity";

export const DashboardOverview = () => {
  const activities = [
    { time: "2 min ago", action: "New order #1234 received", status: "pending" as const },
    { time: "15 min ago", action: "Table #5 payment completed", status: "completed" as const },
    { time: "1 hour ago", action: "Inventory alert: Low stock on wine", status: "alert" as const },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={DollarSign}
          title="Today's Revenue"
          value="$2,456.50"
          trend={{ value: "12% from yesterday", isPositive: true }}
        />
        <StatCard
          icon={ShoppingCart}
          title="Active Orders"
          value="18"
          subtext="4 pending delivery"
        />
        <StatCard
          icon={Users}
          title="Active Staff"
          value="12"
          subtext="3 on break"
        />
      </div>
      <RecentActivity activities={activities} />
    </div>
  );
};
