
import { ReservationsPanel } from "@/components/dashboard/ReservationsPanel";
import { useDashboardState } from "@/hooks/useDashboardState";

const Reservations = () => {
  const { reservations, addReservation, updateReservationStatus } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Reservations</h1>
      <ReservationsPanel
        reservations={reservations}
        onAddReservation={addReservation}
        onUpdateStatus={updateReservationStatus}
      />
    </div>
  );
};

export default Reservations;
