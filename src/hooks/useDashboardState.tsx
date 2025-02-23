
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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
  Promotion,
  DailyReport,
} from "@/types/staff";

export const useDashboardState = () => {
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
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([{
    date: new Date().toISOString(),
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topSellingItems: [],
    laborCosts: 0,
    inventoryCosts: 0,
    netProfit: 0,
  }]);

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

  const addPromotion = (promotionData: Omit<Promotion, "id">) => {
    const newPromotion: Promotion = {
      id: promotions.length + 1,
      ...promotionData,
    };
    setPromotions([...promotions, newPromotion]);
    toast({
      title: "Promotion created",
      description: `${promotionData.name} has been added to active promotions.`,
    });
  };

  const togglePromotion = (promotionId: number) => {
    setPromotions(promotions.map(promo =>
      promo.id === promotionId
        ? { ...promo, active: !promo.active }
        : promo
    ));
    const promo = promotions.find(p => p.id === promotionId);
    toast({
      title: "Promotion updated",
      description: `${promo?.name} has been ${promo?.active ? 'deactivated' : 'activated'}.`,
    });
  };

  return {
    staff,
    inventory,
    orders,
    reservations,
    salesData,
    payments,
    shifts,
    menuItems,
    tables,
    promotions,
    feedback,
    kitchenOrders,
    dailyReports,
    addStaffMember,
    updateStaffStatus,
    addInventoryItem,
    updateInventoryQuantity,
    addOrder,
    updateOrderStatus,
    addReservation,
    updateReservationStatus,
    addShift,
    addSalesData,
    addMenuItem,
    updateMenuItemAvailability,
    updateMenuItemPrice,
    addTable,
    updateTableStatus,
    updateKitchenOrderStatus,
    resolveFeedback,
    addPromotion,
    togglePromotion,
  };
};
