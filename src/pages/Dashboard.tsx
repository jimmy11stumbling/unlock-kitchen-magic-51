
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
import { ChefHat, Bell, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { NotificationsProvider } from "@/hooks/useNotifications";
import { SimulationControls } from "@/components/dashboard/SimulationControls";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Dashboard = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'overview';
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const [showSimulationDialog, setShowSimulationDialog] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <ChefHat className="w-6 h-6 text-primary animate-float" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-gray-400 animate-pulse duration-[3000ms]">
              MaestroAI
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Dialog open={showSimulationDialog} onOpenChange={setShowSimulationDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Database className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Simulation Controls</DialogTitle>
                </DialogHeader>
                <SimulationControls />
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center text-xs text-white">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                  <h4 className="font-semibold">Notifications</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all as read
                  </Button>
                </div>
                <ScrollArea className="h-[300px]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="p-4 cursor-pointer"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-start">
                            <span className={`font-medium ${!notification.read ? 'text-primary' : ''}`}>
                              {notification.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(notification.timestamp, 'HH:mm')}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {notification.message}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </ScrollArea>
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

// Wrap the dashboard with the notifications provider
export default function DashboardWithNotifications() {
  return (
    <NotificationsProvider>
      <Dashboard />
    </NotificationsProvider>
  );
}
