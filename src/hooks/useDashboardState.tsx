
import { useStaffState } from "./dashboard/useStaffState";
import { useInventoryState } from "./dashboard/useInventoryState";
import { useOrderState } from "./dashboard/useOrderState";
import { useMenuState } from "./dashboard/useMenuState";
import { useReservationState } from "./dashboard/useReservationState";
import { useAnalyticsState } from "./dashboard/useAnalyticsState";
import { useLoyaltyState } from "./dashboard/useLoyaltyState";
import { useTableState } from "./dashboard/useTableState";
import { useKitchenState } from "./dashboard/useKitchenState";

export const useDashboardState = () => {
  const staffState = useStaffState();
  const inventoryState = useInventoryState();
  const orderState = useOrderState();
  const menuState = useMenuState();
  const reservationState = useReservationState();
  const analyticsState = useAnalyticsState();
  const loyaltyState = useLoyaltyState();
  const tableState = useTableState();
  const kitchenState = useKitchenState();

  return {
    ...staffState,
    ...inventoryState,
    ...orderState,
    ...menuState,
    ...reservationState,
    ...analyticsState,
    ...loyaltyState,
    ...tableState,
    ...kitchenState,
  };
};
