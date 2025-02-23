import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Users,
  ShoppingCart,
  LayoutDashboard,
  Box,
  Settings,
  Calendar,
  ChefHat,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import type { 
  StaffMember, 
  Shift, 
  InventoryItem, 
  Order, 
  Reservation, 
  SalesData, 
  PaymentTransaction, 
  MenuItem,
  TableLayout,
  KitchenOrder,
  CustomerFeedback,
} from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { OrdersPanel } from "@/components/dashboard/OrdersPanel";
import { StaffPanel } from "@/components/dashboard/StaffPanel";
import { InventoryPanel } from "@/components/dashboard/InventoryPanel";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";
import { ReservationsPanel } from "@/components/dashboard/ReservationsPanel";
import { MenuPanel } from "@/components/dashboard/MenuPanel";
import { TablePanel } from "@/components/dashboard/TablePanel";
import { KitchenDisplay } from "@/components/dashboard/KitchenDisplay";
import { FeedbackPanel } from "@/components/dashboard/FeedbackPanel";

const Dashboard = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<TableLayout[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);

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

  const updateReservationStatus = (reservationId: number, status: Reservation["status"]) => {
    setReservations(reservations.map(reservation =>
      reservation.id === reservationId ? { ...reservation, status } : reservation
    ));
    toast({
      title: "Reservation updated",
      description: `Reservation status has been updated to ${status}.`,
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

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      id: menuItems.length + 1,
      ...item,
    };
    setMenuItems([...menuItems, newItem]);
    toast({
      title: "Menu updated",
      description: `${item.name} has been added to the menu.`,
    });
  };

  const updateMenuItemAvailability = (itemId: number, available: boolean) => {
    setMenuItems(menuItems.map(item =>
      item.id === itemId ? { ...item, available } : item
    ));
    toast({
      title: "Menu item updated",
      description: `Item availability has been updated.`,
    });
  };

  const updateMenuItemPrice = (itemId: number, price: number) => {
    setMenuItems(menuItems.map(item =>
      item.id === itemId ? { ...item, price } : item
    ));
    toast({
      title: "Price updated",
      description: `Item price has been updated.`,
    });
  };

  const addTable = (table: Omit<TableLayout, "id">) => {
    const newTable: TableLayout = {
      id: tables.length + 1,
      ...table,
    };
    setTables([...tables, newTable]);
    toast({
      title: "Table added",
      description: `Table ${table.number} has been added.`,
    });
  };

  const updateTableStatus = (tableId: number, status: TableLayout["status"]) => {
    setTables(tables.map(table =>
      table.id === tableId ? { ...table, status } : table
    ));
    toast({
      title: "Table status updated",
      description: `Table status has been updated to ${status}.`,
    });
  };

  const updateKitchenOrderStatus = (
    orderId: number,
    itemId: number,
    status: KitchenOrder["items"][0]["status"]
  ) => {
    setKitchenOrders(
      kitchenOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.menuItemId === itemId
                  ? {
                      ...item,
                      status,
                      startTime: status === "preparing" ? new Date().toISOString() : item.startTime,
                      completionTime:
                        status === "delivered" ? new Date().toISOString() : item.completionTime,
                    }
                  : item
              ),
            }
          : order
      )
    );

    toast({
      title: "Order status updated",
      description: `Item status updated to ${status}`,
    });
  };

  const resolveFeedback = (feedbackId: number) => {
    setFeedback(
      feedback.map((item) =>
        item.id === feedbackId ? { ...item, resolved: true } : item
      )
    );

    toast({
      title: "Feedback resolved",
      description: "The feedback has been marked as resolved.",
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
            <TabsTrigger value="reservations" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
              <Calendar className="h-4 w-4 mr-2" />
              Reservations
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
            <TabsTrigger value="menu" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
              Menu
            </TabsTrigger>
            <TabsTrigger value="tables" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
              Tables
            </TabsTrigger>
            <TabsTrigger value="kitchen" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
              <ChefHat className="h-4 w-4 mr-2" />
              Kitchen
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
              <MessageSquare className="h-4 w-4 mr-2" />
              Feedback
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

          <TabsContent value="reservations">
            <ReservationsPanel
              reservations={reservations}
              onAddReservation={addReservation}
              onUpdateStatus={updateReservationStatus}
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
            <InventoryPanel 
              inventory={inventory}
              onUpdateQuantity={updateInventoryQuantity}
              onAddItem={addInventoryItem}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsPanel salesData={salesData} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>

          <TabsContent value="menu">
            <MenuPanel
              menuItems={menuItems}
              onAddMenuItem={addMenuItem}
              onUpdateAvailability={updateMenuItemAvailability}
              onUpdatePrice={updateMenuItemPrice}
            />
          </TabsContent>

          <TabsContent value="tables">
            <TablePanel
              tables={tables}
              onAddTable={addTable}
              onUpdateStatus={updateTableStatus}
            />
          </TabsContent>

          <TabsContent value="kitchen">
            <KitchenDisplay
              kitchenOrders={kitchenOrders}
              menuItems={menuItems}
              onUpdateOrderStatus={updateKitchenOrderStatus}
            />
          </TabsContent>

          <TabsContent value="feedback">
            <FeedbackPanel
              feedback={feedback}
              onResolveFeedback={resolveFeedback}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
