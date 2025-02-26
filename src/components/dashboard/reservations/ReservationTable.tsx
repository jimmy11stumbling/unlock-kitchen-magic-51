
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Reservation } from "@/types/staff";

interface ReservationTableProps {
  reservations: Reservation[];
  onUpdateStatus: (reservationId: number, status: Reservation["status"]) => void;
  getStatusColor: (status: Reservation["status"]) => string;
}

export const ReservationTable = ({
  reservations,
  onUpdateStatus,
  getStatusColor,
}: ReservationTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Table</TableHead>
          <TableHead>Party Size</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservations.map((reservation) => (
          <TableRow key={reservation.id}>
            <TableCell>{reservation.customerName}</TableCell>
            <TableCell>{reservation.date}</TableCell>
            <TableCell>{reservation.time}</TableCell>
            <TableCell>{reservation.tableNumber}</TableCell>
            <TableCell>{reservation.partySize}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(reservation.status)}>
                {reservation.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {reservation.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => onUpdateStatus(reservation.id, "confirmed")}
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onUpdateStatus(reservation.id, "cancelled")}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {reservation.status === "confirmed" && (
                  <Button
                    size="sm"
                    onClick={() => onUpdateStatus(reservation.id, "cancelled")}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
