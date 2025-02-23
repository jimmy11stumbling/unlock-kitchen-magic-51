
import { Outlet } from "react-router-dom";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your restaurant dashboard</p>
          </div>
          <div className="w-80">
            <NotificationsPanel />
          </div>
        </div>

        <DashboardTabs />
        
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
