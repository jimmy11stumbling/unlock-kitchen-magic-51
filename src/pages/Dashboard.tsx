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
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StaffTable } from "@/components/dashboard/StaffTable";
import { AddStaffForm } from "@/components/dashboard/AddStaffForm";
import { ScheduleView } from "@/components/dashboard/ScheduleView";
import type { StaffMember, Shift, InventoryItem, Order, Reservation, SalesData, PaymentTransaction } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 1, name: "John Smith", role: "Chef", status: "active", shift: "Morning", salary: "45000" },
    { id: 2, name: "Sarah Johnson", role: "Server", status: "on_break", shift: "Evening", salary: "35000" },
    { id: 3, name: "Mike Wilson", role: "Bartender", status: "active", shift: "Night", salary: "40000" },
    { id: 4, name: "Emily Brown", role: "Host", status: "off_duty", shift: "Morning", salary: "32000" },
  ]);

  const [inventory] = useState<InventoryItem[]>([
    { id: 1, name: "Tomatoes", quantity: 50, unit: "kg", minQuantity: 20, price: 2.5 },
    { id: 2, name: "Chicken", quantity: 15, unit: "kg", minQuantity: 25, price: 8.0 },
    { id: 3, name: "Wine", quantity: 10, unit: "bottles", minQuantity: 15, price: 25.0 },
  ]);

  const [orders] = useState<Order[]>([
    {
      id: 1,
      tableNumber: 5,
      items: [{ id: 1, name: "Pasta", quantity: 2, price: 15.99 }],
      status: "pending",
      total: 31.98,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [reservations] = useState<Reservation[]>([
    {
      id: 1,
      customerName: "John Doe",
      date: "2024-02-21",
      time: "19:00",
      partySize: 4,
      tableNumber: 7,
      status: "confirmed",
    },
  ]);

  const [salesData] = useState<SalesData[]>([
    {
      date: "2024-02-20",
      revenue: 2456.50,
      costs: 1234.25,
      profit: 1222.25,
    },
  ]);

  const [payments] = useState<PaymentTransaction[]>([
    {
      id: 1,
      orderId: 1,
      amount: 31.98,
      method: "credit",
      status: "completed",
      timestamp: new Date().toISOString(),
    },
  ]);

  const [shifts, setShifts] = useState<Shift[]>([
    { id: 1, staffId: 1, date: "2024-02-20", time: "6:00 AM - 2:00 PM" },
    { id: 2, staffId: 2, date: "2024-02-20", time: "2:00 PM - 10:00 PM" },
    { id: 3, staffId: 3, date: "2024-02-20", time: "5:00 PM - 1:00 AM" },
  ]);

  const onSubmit = (data: { name: string; role: string; salary: string }) => {
    const newStaffMember: StaffMember = {
      id: staff.length + 1,
      name: data.name,
      role: data.role,
      status: "off_duty",
      shift: "Morning",
      salary: data.salary,
    };
    setStaff([...staff, newStaffMember]);
    toast({
      title: "Staff member added",
      description: `${data.name} has been added to the staff list.`,
    });
  };

  const updateStaffStatus = (staffId: number, newStatus: StaffMember["status"]) => {
    setStaff(staff.map(member => 
      member.id === staffId ? { ...member, status: newStatus } : member
    ));
    const member = staff.find(m => m.id === staffId);
    toast({
      title: "Status updated",
      description: `${member?.name}'s status has been updated to ${newStatus.replace("_", " ")}.`,
    });
  };

  const addShift = (staffId: number, date: string, time: string) => {
    const newShift: Shift = {
      id: shifts.length + 1,
      staffId,
      date,
      time,
    };
    setShifts([...shifts, newShift]);
    const member = staff.find(m => m.id === staffId);
    toast({
      title: "Shift added",
      description: `New shift added for ${member?.name} on ${date}.`,
    });
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
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4>Order #{order.id} - Table {order.tableNumber}</h4>
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-2">
                      {order.items.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
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
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Staff Member</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Shift Time</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {shifts.map((shift) => {
                              const staffMember = staff.find((s) => s.id === shift.staffId);
                              return (
                                <TableRow key={shift.id}>
                                  <TableCell>{staffMember?.name}</TableCell>
                                  <TableCell>{shift.date}</TableCell>
                                  <TableCell>{shift.time}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
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
                        <Form>
                          <FormField
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="chef">Chef</SelectItem>
                                    <SelectItem value="server">Server</SelectItem>
                                    <SelectItem value="bartender">Bartender</SelectItem>
                                    <SelectItem value="host">Host</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </Form>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              <Card className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Current Shift</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            member.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                            member.status === "on_break" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                            "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                          }`}>
                            {member.status === "active" ? (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            ) : member.status === "on_break" ? (
                              <Clock className="w-3 h-3 mr-1" />
                            ) : (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {member.status.replace("_", " ")}
                          </span>
                        </TableCell>
                        <TableCell>{member.shift}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Inventory Control</h3>
              <div className="space-y-4">
                {inventory.map(item => (
                  <div key={item.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4>{item.name}</h4>
                      {item.quantity < item.minQuantity && (
                        <span className="flex items-center text-red-500">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Low Stock
                        </span>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <p>{item.quantity} {item.unit}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Min. Quantity:</span>
                        <p>{item.minQuantity} {item.unit}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <p>${item.price}/{item.unit}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Sales Analytics</h3>
              <div className="space-y-4">
                {salesData.map((data, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <h4 className="font-medium">{data.date}</h4>
                    <div className="mt-2 grid grid-cols-3 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Revenue</span>
                        <p className="text-green-600 font-semibold">${data.revenue.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Costs</span>
                        <p className="text-red-600 font-semibold">${data.costs.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Profit</span>
                        <p className="text-blue-600 font-semibold">${data.profit.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Settings</h3>
              <p className="text-muted-foreground">Configure your restaurant settings here.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
