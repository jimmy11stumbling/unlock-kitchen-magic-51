
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Reservation } from "@/types/staff";

interface ReservationMetricsProps {
  reservations: Reservation[];
}

export const ReservationMetrics = ({ reservations }: ReservationMetricsProps) => {
  const getReservationsByStatus = (status: Reservation["status"]) =>
    reservations.filter((r) => r.status === status).length;

  const totalReservations = reservations.length;
  const confirmedReservations = getReservationsByStatus("confirmed");
  const pendingReservations = getReservationsByStatus("pending");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">Total</h3>
          <Badge variant="secondary">{totalReservations}</Badge>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">Confirmed</h3>
          <Badge variant="success">{confirmedReservations}</Badge>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
          <Badge variant="warning">{pendingReservations}</Badge>
        </div>
      </Card>
    </div>
  );
};
