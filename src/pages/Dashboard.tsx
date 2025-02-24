
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
import Orders from "@/routes/dashboard/Orders";
import Vendors from "@/routes/dashboard/Vendors";
import { useLocation } from "react-router-dom";
import { ChefHat, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'overview';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-playfair text-xl font-semibold">MaestroAI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">New Order</span>
                    <span className="text-sm text-muted-foreground">Table 5 placed a new order</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Low Inventory Alert</span>
                    <span className="text-sm text-muted-foreground">Wine stock running low</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="border-b">
        <div className="px-4 py-4">
          <Tabs value={currentTab} className="space-y-4">
            <DashboardTabs />
            <TabsContent value="overview" className="m-0">
              <Overview />
            </TabsContent>
            <TabsContent value="orders" className="m-0">
              <Orders />
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
            <TabsContent value="vendors" className="m-0">
              <Vendors />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container flex flex-col md:flex-row justify-between items-center py-4 px-4">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <ChefHat className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">MaestroAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 MaestroAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
