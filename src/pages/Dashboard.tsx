
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Clock,
  LayoutDashboard,
  Box,
  Settings,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your restaurant dashboard</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted/50 dark:bg-muted/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="staff" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
              <Users className="h-4 w-4 mr-2" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
              <Box className="h-4 w-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
              <BarChart className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6 space-y-2 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-sage-100 dark:bg-sage-900 rounded-lg">
                    <DollarSign className="h-6 w-6 text-sage-500 dark:text-sage-400" />
                  </div>
                  <h3 className="text-sm font-medium dark:text-white">Today's Revenue</h3>
                </div>
                <div className="text-2xl font-bold dark:text-white">$2,456.50</div>
                <div className="flex items-center text-sm text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  12% from yesterday
                </div>
              </Card>

              <Card className="p-6 space-y-2 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-sage-100 dark:bg-sage-900 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-sage-500 dark:text-sage-400" />
                  </div>
                  <h3 className="text-sm font-medium dark:text-white">Active Orders</h3>
                </div>
                <div className="text-2xl font-bold dark:text-white">18</div>
                <div className="text-sm text-muted-foreground">4 pending delivery</div>
              </Card>

              <Card className="p-6 space-y-2 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-sage-100 dark:bg-sage-900 rounded-lg">
                    <Users className="h-6 w-6 text-sage-500 dark:text-sage-400" />
                  </div>
                  <h3 className="text-sm font-medium dark:text-white">Active Staff</h3>
                </div>
                <div className="text-2xl font-bold dark:text-white">12</div>
                <div className="text-sm text-muted-foreground">3 on break</div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { time: "2 min ago", action: "New order #1234 received", status: "pending" },
                  { time: "15 min ago", action: "Table #5 payment completed", status: "completed" },
                  { time: "1 hour ago", action: "Inventory alert: Low stock on wine", status: "alert" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-sage-100 dark:bg-sage-900 rounded-full">
                        <Clock className="h-4 w-4 text-sage-500 dark:text-sage-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium dark:text-white">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === "completed" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                      activity.status === "alert" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Orders Management</h3>
              <p className="text-muted-foreground">Orders management content coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Staff Management</h3>
              <p className="text-muted-foreground">Staff management content coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Inventory Control</h3>
              <p className="text-muted-foreground">Inventory control content coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Analytics</h3>
              <p className="text-muted-foreground">Analytics content coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Settings</h3>
              <p className="text-muted-foreground">Settings content coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
