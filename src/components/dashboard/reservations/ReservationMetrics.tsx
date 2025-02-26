
import { Card } from "@/components/ui/card";
import { CalendarDays, Users, Clock } from "lucide-react";
import type { Reservation } from "@/types/staff";

interface ReservationMetricsProps {
  reservations: Reservation[];
}

export const ReservationMetrics = ({ reservations }: ReservationMetricsProps) => {
  const todayDate = new Date().toISOString().split('T')[0];
  const todayReservations = reservations.filter(
    (r) => r.date === todayDate && r.status !== "cancelled"
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <CalendarDays className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm text-muted-foreground">Today's Reservations</p>
            <p className="text-2xl font-bold">{todayReservations.length}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Users className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-sm text-muted-foreground">Total Guests Today</p>
            <p className="text-2xl font-bold">
              {todayReservations.reduce((sum, r) => sum + r.partySize, 0)}
            </p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-8 h-8 text-purple-500" />
          <div>
            <p className="text-sm text-muted-foreground">Pending Confirmations</p>
            <p className="text-2xl font-bold">
              {reservations.filter((r) => r.status === "pending").length}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
