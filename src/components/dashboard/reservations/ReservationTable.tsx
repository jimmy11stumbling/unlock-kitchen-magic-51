
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
          <TableHead>Party Size</TableHead>
          <TableHead>Table</TableHead>
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
            <TableCell>{reservation.partySize}</TableCell>
            <TableCell>#{reservation.tableNumber}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(reservation.status)}`}>
                {reservation.status}
              </span>
            </TableCell>
            <TableCell>
              <Select
                value={reservation.status}
                onValueChange={(value: Reservation["status"]) =>
                  onUpdateStatus(reservation.id, value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirm</SelectItem>
                  <SelectItem value="cancelled">Cancel</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
