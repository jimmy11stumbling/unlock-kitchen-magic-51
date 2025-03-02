import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Reservation } from "@/types/staff";

interface ReservationMetricsProps {
  reservations: Reservation[];
}

export const ReservationMetrics = ({ reservations }: ReservationMetricsProps) => {
  const getStatusCounts = (reservations: Reservation[]) => {
    return {
      total: reservations.length,
      confirmed: reservations.filter(r => r.status === "confirmed").length,
      pending: reservations.filter(r => r.status === "pending").length,
      cancelled: reservations.filter(r => r.status === "cancelled").length,
      seated: reservations.filter(r => r.status === "seated").length,
      completed: reservations.filter(r => r.status === "completed").length
    };
  };

  const metrics = [
    { label: "Total", count: getStatusCounts(reservations).total, variant: "secondary" as const },
    { label: "Confirmed", count: getStatusCounts(reservations).confirmed, variant: "success" as const },
    { label: "Pending", count: getStatusCounts(reservations).pending, variant: "secondary" as const },
    { label: "Seated", count: getStatusCounts(reservations).seated, variant: "default" as const },
    { label: "Completed", count: getStatusCounts(reservations).completed, variant: "success" as const },
    { label: "Cancelled", count: getStatusCounts(reservations).cancelled, variant: "destructive" as const }
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
