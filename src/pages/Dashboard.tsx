
import { Outlet, useLocation } from "react-router-dom";
import { Tabs } from "@/components/ui/tabs";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";

const Dashboard = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'overview';

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

        <Tabs value={currentTab} defaultValue="overview">
          <DashboardTabs />
        </Tabs>
        
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
