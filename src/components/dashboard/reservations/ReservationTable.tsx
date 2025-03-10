
import React from "react";
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
import type { Reservation } from "@/types/reservations";
import type { ReservationStatus } from "@/types/reservations";
import { getNextAllowedStatuses } from "./utils";

interface ReservationTableProps {
  reservations: Reservation[];
  onUpdateStatus: (reservationId: number, status: ReservationStatus) => void;
  getStatusColor: (status: ReservationStatus) => string;
}

export const ReservationTable = ({
  reservations,
  onUpdateStatus,
  getStatusColor,
}: ReservationTableProps) => {
  const renderActionButtons = (reservation: Reservation) => {
    const nextStatuses = getNextAllowedStatuses(reservation.status);
    
    return nextStatuses.map(status => (
      <Button
        key={status}
        size="sm"
        variant={status === "cancelled" || status === "no-show" ? "destructive" : "default"}
        onClick={() => onUpdateStatus(reservation.id, status as ReservationStatus)}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Button>
    ));
  };

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
            <TableCell>
              <div>
                <div>{reservation.customerName}</div>
                {reservation.customerPhone && (
                  <div className="text-sm text-muted-foreground">{reservation.customerPhone}</div>
                )}
              </div>
            </TableCell>
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
                {renderActionButtons(reservation)}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
