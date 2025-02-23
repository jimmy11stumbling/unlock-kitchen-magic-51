
import { useStaffState } from "./useStaffState";
import { useInventoryState } from "./useInventoryState";
import { useOrderState } from "./useOrderState";
import { useMenuState } from "./useMenuState";
import { useReservationState } from "./useReservationState";
import { useAnalyticsState } from "./useAnalyticsState";
import { useLoyaltyState } from "./useLoyaltyState";
import { useTableState } from "./useTableState";

export const useDashboardState = () => {
  const staffState = useStaffState();
  const inventoryState = useInventoryState();
  const orderState = useOrderState();
  const menuState = useMenuState();
  const reservationState = useReservationState();
  const analyticsState = useAnalyticsState();
  const loyaltyState = useLoyaltyState();
  const tableState = useTableState();

  return {
    ...staffState,
    ...inventoryState,
    ...orderState,
    ...menuState,
    ...reservationState,
    ...analyticsState,
    ...loyaltyState,
    ...tableState,
  };
};
