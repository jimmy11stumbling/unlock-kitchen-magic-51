
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  ShoppingCart,
  LayoutDashboard,
  Box,
  Settings,
  Users,
  UserPlus,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { StaffTable } from "@/components/dashboard/StaffTable";
import { AddStaffForm } from "@/components/dashboard/AddStaffForm";
import { ScheduleView } from "@/components/dashboard/ScheduleView";
import { DashboardOverview } from "@/components/dashboard/overview/DashboardOverview";
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

          <TabsContent value="overview">
            <DashboardOverview />
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
