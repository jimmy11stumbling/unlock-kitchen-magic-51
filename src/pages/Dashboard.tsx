
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

  // Staff Management Functions
  const addStaffMember = (data: { name: string; role: string; salary: string }) => {
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

  // Inventory Management Functions
  const addInventoryItem = (item: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = {
      id: inventory.length + 1,
      ...item,
    };
    setInventory([...inventory, newItem]);
    toast({
      title: "Inventory updated",
      description: `${item.name} has been added to inventory.`,
    });
  };

  const updateInventoryQuantity = (itemId: number, quantity: number) => {
    setInventory(inventory.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  // Order Management Functions
  const addOrder = (order: Omit<Order, "id" | "timestamp">) => {
    const newOrder: Order = {
      id: orders.length + 1,
      timestamp: new Date().toISOString(),
      ...order,
    };
    setOrders([...orders, newOrder]);
    toast({
      title: "New order created",
      description: `Order #${newOrder.id} has been created.`,
    });
  };

  const updateOrderStatus = (orderId: number, status: Order["status"]) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };

  // Reservation Management Functions
  const addReservation = (reservation: Omit<Reservation, "id">) => {
    const newReservation: Reservation = {
      id: reservations.length + 1,
      ...reservation,
    };
    setReservations([...reservations, newReservation]);
    toast({
      title: "Reservation confirmed",
      description: `Reservation for ${reservation.customerName} has been confirmed.`,
    });
  };

  // Payment Processing Functions
  const processPayment = (payment: Omit<PaymentTransaction, "id" | "timestamp" | "status">) => {
    const newPayment: PaymentTransaction = {
      id: payments.length + 1,
      timestamp: new Date().toISOString(),
      status: "completed",
      ...payment,
    };
    setPayments([...payments, newPayment]);
    
    // Update order status when payment is processed
    updateOrderStatus(payment.orderId, "delivered");
    
    toast({
      title: "Payment processed",
      description: `Payment of $${payment.amount.toFixed(2)} has been processed.`,
    });
  };

  // Schedule Management Functions
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

  // Sales Analytics Functions
  const addSalesData = (data: Omit<SalesData, "profit">) => {
    const profit = data.revenue - data.costs;
    const newSalesData: SalesData = {
      ...data,
      profit,
    };
    setSalesData([...salesData, newSalesData]);
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Total Revenue</h3>
                </div>
                <div className="text-2xl font-bold">
                  ${salesData.reduce((acc, curr) => acc + curr.revenue, 0).toFixed(2)}
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Active Staff</h3>
                </div>
                <div className="text-2xl font-bold">
                  {staff.filter(s => s.status === "active").length}
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Pending Orders</h3>
                </div>
                <div className="text-2xl font-bold">
                  {orders.filter(o => o.status === "pending").length}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="staff">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Staff Management</h2>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Staff
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Add New Staff Member</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <AddStaffForm onSubmit={addStaffMember} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              <StaffTable
                staff={staff}
                onUpdateStatus={updateStaffStatus}
                onAddShift={addShift}
              />
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Inventory Control</h2>
                <Button onClick={() => {
                  // Add inventory item dialog
                }}>
                  <Box className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Min. Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.minQuantity}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>
                        {item.quantity < item.minQuantity ? (
                          <span className="text-red-500 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Low Stock
                          </span>
                        ) : (
                          <span className="text-green-500 flex items-center">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            In Stock
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Sales Analytics</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {salesData.map((data, index) => (
                  <Card key={index} className="p-4">
                    <h3 className="text-sm font-medium">{data.date}</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Revenue</span>
                        <span className="font-medium text-green-600">
                          ${data.revenue.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Costs</span>
                        <span className="font-medium text-red-600">
                          ${data.costs.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Profit</span>
                        <span className="font-medium text-blue-600">
                          ${data.profit.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Order Management</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Table {order.tableNumber}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "delivered" ? "bg-green-100 text-green-700" :
                          order.status === "preparing" ? "bg-blue-100 text-blue-700" :
                          order.status === "ready" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Table>
                        <TableBody>
                          {order.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>x{item.quantity}</TableCell>
                              <TableCell className="text-right">
                                ${item.price.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={2} className="font-medium">Total</TableCell>
                            <TableCell className="text-right font-medium">
                              ${order.total.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => updateOrderStatus(order.id, "preparing")}
                        disabled={order.status !== "pending"}
                      >
                        Start Preparing
                      </Button>
                      <Button
                        onClick={() => updateOrderStatus(order.id, "ready")}
                        disabled={order.status !== "preparing"}
                      >
                        Mark as Ready
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Settings</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Restaurant Information</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      General Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Staff Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Settings
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">System</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start text-red-600">
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
