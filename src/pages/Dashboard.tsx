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
  UserPlus,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StaffTable } from "@/components/dashboard/StaffTable";
import { AddStaffForm } from "@/components/dashboard/AddStaffForm";
import { ScheduleView } from "@/components/dashboard/ScheduleView";
import type { StaffMember, Shift } from "@/types/staff";

const Dashboard = () => {
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 1, name: "John Smith", role: "Chef", status: "active", shift: "Morning" },
    { id: 2, name: "Sarah Johnson", role: "Server", status: "on_break", shift: "Evening" },
    { id: 3, name: "Mike Wilson", role: "Bartender", status: "active", shift: "Night" },
    { id: 4, name: "Emily Brown", role: "Host", status: "off_duty", shift: "Morning" },
  ]);

  const [shifts, setShifts] = useState<Shift[]>([
    { id: 1, staffId: 1, date: "2024-02-20", time: "6:00 AM - 2:00 PM" },
    { id: 2, staffId: 2, date: "2024-02-20", time: "2:00 PM - 10:00 PM" },
    { id: 3, staffId: 3, date: "2024-02-20", time: "5:00 PM - 1:00 AM" },
  ]);

  const onSubmit = (data: { role: string }) => {
    const newStaffMember: StaffMember = {
      id: staff.length + 1,
      name: `New Staff ${staff.length + 1}`,
      role: data.role,
      status: "off_duty",
      shift: "Morning",
    };
    setStaff([...staff, newStaffMember]);
  };

  const updateStaffStatus = (staffId: number, newStatus: StaffMember["status"]) => {
    setStaff(staff.map(member => 
      member.id === staffId ? { ...member, status: newStatus } : member
    ));
  };

  const addShift = (staffId: number, date: string, time: string) => {
    const newShift: Shift = {
      id: shifts.length + 1,
      staffId,
      date,
      time,
    };
    setShifts([...shifts, newShift]);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="space-y-8">
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
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold dark:text-white">Staff Management</h2>
                <div className="space-x-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Calendar className="h-4 w-4 mr-2" />
                        View Schedule
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Staff Schedule</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        <ScheduleView shifts={shifts} staff={staff} />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Staff
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Add New Staff Member</SheetTitle>
                      </SheetHeader>
                      <div className="mt-4 space-y-4">
                        <AddStaffForm onSubmit={onSubmit} />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <Card className="p-6">
                <StaffTable 
                  staff={staff} 
                  onUpdateStatus={updateStaffStatus}
                  onAddShift={addShift}
                />
              </Card>
            </div>
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
