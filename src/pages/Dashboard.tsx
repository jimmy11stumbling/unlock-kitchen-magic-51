import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Users,
  ShoppingCart,
  LayoutDashboard,
  Box,
  Settings,
} from "lucide-react";
import { useState } from "react";
import type { StaffMember, Shift, InventoryItem, Order, Reservation, SalesData, PaymentTransaction } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { OrdersPanel } from "@/components/dashboard/OrdersPanel";
import { StaffPanel } from "@/components/dashboard/StaffPanel";
import { InventoryPanel } from "@/components/dashboard/InventoryPanel";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";

const Dashboard = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);

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
    if (quantity < 0) {
      toast({
        title: "Error",
        description: "Quantity cannot be negative.",
        variant: "destructive",
      });
      return;
    }

    setInventory(inventory.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, quantity };
        if (updatedItem.quantity <= updatedItem.minQuantity) {
          toast({
            title: "Low stock alert",
            description: `${item.name} is running low on stock.`,
            variant: "destructive",
          });
        }
        return updatedItem;
      }
      return item;
    }));
  };

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

  const processPayment = (payment: Omit<PaymentTransaction, "id" | "timestamp" | "status">) => {
    const newPayment: PaymentTransaction = {
      id: payments.length + 1,
      timestamp: new Date().toISOString(),
      status: "completed",
      ...payment,
    };
    setPayments([...payments, newPayment]);
    
    updateOrderStatus(payment.orderId, "delivered");
    
    toast({
      title: "Payment processed",
      description: `Payment of $${payment.amount.toFixed(2)} has been processed.`,
    });
  };

  const addShift = (staffId: number, date: string, time: string) => {
    const newShift: Shift = {
      id: shifts.length + 1,
      staffId,
      date,
      time,
    };
    
    const hasOverlap = shifts.some(
      shift => shift.staffId === staffId && shift.date === date && shift.time === time
    );

    if (hasOverlap) {
      toast({
        title: "Schedule conflict",
        description: "This staff member already has a shift during this time.",
        variant: "destructive",
      });
      return;
    }

    setShifts([...shifts, newShift]);
    const member = staff.find(m => m.id === staffId);
    toast({
      title: "Shift added",
      description: `New shift added for ${member?.name} on ${date}.`,
    });
  };

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
            <DashboardOverview 
              salesData={salesData}
              staff={staff}
              orders={orders}
            />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersPanel 
              orders={orders}
              updateOrderStatus={updateOrderStatus}
            />
          </TabsContent>

          <TabsContent value="staff">
            <StaffPanel
              staff={staff}
              onAddStaff={addStaffMember}
              onUpdateStatus={updateStaffStatus}
              onAddShift={addShift}
            />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryPanel inventory={inventory} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsPanel salesData={salesData} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
