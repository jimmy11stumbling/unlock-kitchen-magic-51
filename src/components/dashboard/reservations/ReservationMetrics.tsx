
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Reservation } from "@/types/staff";

interface ReservationMetricsProps {
  reservations: Reservation[];
}

export const ReservationMetrics = ({ reservations }: ReservationMetricsProps) => {
  const getReservationsByStatus = (status: Reservation["status"]) =>
    reservations.filter((r) => r.status === status).length;

  const metrics = [
    { label: "Total", count: reservations.length, variant: "secondary" as const },
    { label: "Confirmed", count: getReservationsByStatus("confirmed"), variant: "success" as const },
    { label: "Pending", count: getReservationsByStatus("pending"), variant: "secondary" as const },
    { label: "Seated", count: getReservationsByStatus("seated"), variant: "default" as const },
    { label: "Completed", count: getReservationsByStatus("completed"), variant: "success" as const },
    { label: "Cancelled", count: getReservationsByStatus("cancelled"), variant: "destructive" as const }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-muted-foreground">{metric.label}</h3>
            <Badge variant={metric.variant}>{metric.count}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
};
