
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useDashboardState } from "@/hooks/useDashboardState";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
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
import { PromotionsPanel } from "@/components/dashboard/PromotionsPanel";
import { DailyReportsPanel } from "@/components/dashboard/DailyReportsPanel";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { LoyaltyPanel } from "@/components/dashboard/LoyaltyPanel";

const Dashboard = () => {
  const {
    staff,
    inventory,
    orders,
    reservations,
    salesData,
    menuItems,
    tables,
    promotions,
    feedback,
    kitchenOrders,
    dailyReports,
    members,
    addStaffMember,
    updateStaffStatus,
    addInventoryItem,
    updateInventoryQuantity,
    updateOrderStatus,
    addReservation,
    updateReservationStatus,
    addMenuItem,
    updateMenuItemAvailability,
    updateMenuItemPrice,
    addTable,
    updateTableStatus,
    updateKitchenOrderStatus,
    resolveFeedback,
    addPromotion,
    togglePromotion,
    addShift,
    addMember,
    addPoints,
  } = useDashboardState();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your restaurant dashboard</p>
          </div>
          <div className="w-80">
            <NotificationsPanel />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <DashboardTabs />

          <TabsContent value="overview">
            <DashboardOverview 
              salesData={salesData}
              staff={staff}
              orders={orders}
            />
          </TabsContent>

          <TabsContent value="daily-reports">
            <DailyReportsPanel reports={dailyReports} />
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

          <TabsContent value="loyalty">
            <LoyaltyPanel
              members={members}
              onAddMember={addMember}
              onAddPoints={addPoints}
            />
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

          <TabsContent value="promotions">
            <PromotionsPanel
              promotions={promotions}
              onAddPromotion={addPromotion}
              onTogglePromotion={togglePromotion}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
