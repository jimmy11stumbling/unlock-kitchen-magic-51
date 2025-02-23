
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import Menu from "@/routes/dashboard/Menu";
import Overview from "@/routes/dashboard/Overview";
import Kitchen from "@/routes/dashboard/Kitchen";
import Staff from "@/routes/dashboard/Staff";
import Inventory from "@/routes/dashboard/Inventory";
import Analytics from "@/routes/dashboard/Analytics";
import Settings from "@/routes/dashboard/Settings";
import DailyReports from "@/routes/dashboard/DailyReports";
import Reservations from "@/routes/dashboard/Reservations";
import Feedback from "@/routes/dashboard/Feedback";
import Promotions from "@/routes/dashboard/Promotions";
import Tables from "@/routes/dashboard/Tables";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'overview';

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="px-4 py-4">
          <Tabs value={currentTab} className="space-y-4">
            <DashboardTabs />
            <TabsContent value="overview" className="m-0">
              <Overview />
            </TabsContent>
            <TabsContent value="menu" className="m-0">
              <Menu />
            </TabsContent>
            <TabsContent value="kitchen" className="m-0">
              <Kitchen />
            </TabsContent>
            <TabsContent value="staff" className="m-0">
              <Staff />
            </TabsContent>
            <TabsContent value="inventory" className="m-0">
              <Inventory />
            </TabsContent>
            <TabsContent value="analytics" className="m-0">
              <Analytics />
            </TabsContent>
            <TabsContent value="settings" className="m-0">
              <Settings />
            </TabsContent>
            <TabsContent value="daily-reports" className="m-0">
              <DailyReports />
            </TabsContent>
            <TabsContent value="reservations" className="m-0">
              <Reservations />
            </TabsContent>
            <TabsContent value="feedback" className="m-0">
              <Feedback />
            </TabsContent>
            <TabsContent value="promotions" className="m-0">
              <Promotions />
            </TabsContent>
            <TabsContent value="tables" className="m-0">
              <Tables />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
