
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import type { Reservation } from "@/types/staff";

interface ReservationsPanelProps {
  reservations: Reservation[];
  onAddReservation: (reservation: Omit<Reservation, "id">) => void;
  onUpdateStatus: (reservationId: number, status: Reservation["status"]) => void;
}

export const ReservationsPanel = ({ 
  reservations,
  onAddReservation,
  onUpdateStatus
}: ReservationsPanelProps) => {
  const [newReservation, setNewReservation] = useState<Omit<Reservation, "id">>({
    customerName: "",
    date: "",
    time: "",
    partySize: 1,
    tableNumber: 1,
    status: "pending",
    notes: ""
  });

  const [filter, setFilter] = useState<Reservation["status"] | "all">("all");

  const filteredReservations = filter === "all" 
    ? reservations 
    : reservations.filter(res => res.status === filter);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Reservations</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Reservation</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>New Reservation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Customer Name</label>
                  <Input 
                    value={newReservation.customerName}
                    onChange={(e) => setNewReservation({ ...newReservation, customerName: e.target.value })}
                    placeholder="Customer name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Date</label>
                    <Input 
                      type="date"
                      value={newReservation.date}
                      onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Time</label>
                    <Input 
                      type="time"
                      value={newReservation.time}
                      onChange={(e) => setNewReservation({ ...newReservation, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Party Size</label>
                    <Input 
                      type="number"
                      min="1"
                      value={newReservation.partySize}
                      onChange={(e) => setNewReservation({ ...newReservation, partySize: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Table Number</label>
                    <Input 
                      type="number"
                      min="1"
                      value={newReservation.tableNumber}
                      onChange={(e) => setNewReservation({ ...newReservation, tableNumber: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Input 
                    value={newReservation.notes}
                    onChange={(e) => setNewReservation({ ...newReservation, notes: e.target.value })}
                    placeholder="Any special requests or notes"
                  />
                </div>
                <Button 
                  className="w-full"
                  onClick={() => {
                    onAddReservation(newReservation);
                    setNewReservation({
                      customerName: "",
                      date: "",
                      time: "",
                      partySize: 1,
                      tableNumber: 1,
                      status: "pending",
                      notes: ""
                    });
                  }}
                >
                  Add Reservation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-4">
          <Select
            value={filter}
            onValueChange={(value: Reservation["status"] | "all") => setFilter(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reservations</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
            {filteredReservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.customerName}</TableCell>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell>{reservation.partySize}</TableCell>
                <TableCell>{reservation.tableNumber}</TableCell>
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
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
