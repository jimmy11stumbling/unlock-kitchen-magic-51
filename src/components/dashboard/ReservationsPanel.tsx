
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import type { Reservation } from "@/types/staff";
import { CalendarDays, Users, Clock } from "lucide-react";

interface ReservationsPanelProps {
  reservations: Reservation[];
  onAddReservation: (reservation: Omit<Reservation, "id">) => void;
  onUpdateStatus: (reservationId: number, status: Reservation["status"]) => void;
}

export const ReservationsPanel = ({
  reservations,
  onAddReservation,
  onUpdateStatus,
}: ReservationsPanelProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newReservation, setNewReservation] = useState<Omit<Reservation, "id">>({
    customerName: "",
    date: new Date().toISOString().split('T')[0],
    time: "18:00",
    partySize: 2,
    tableNumber: 1,
    status: "pending",
    notes: "",
  });

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "confirmed": return "text-green-600 bg-green-100";
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const isTimeSlotAvailable = (time: string, date: string, tableNumber: number) => {
    return !reservations.some(
      (r) =>
        r.date === date &&
        r.time === time &&
        r.tableNumber === tableNumber &&
        r.status !== "cancelled"
    );
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Reservations</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <CalendarDays className="w-4 h-4 mr-2" />
                New Reservation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Reservation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Customer Name</label>
                  <Input
                    value={newReservation.customerName}
                    onChange={(e) =>
                      setNewReservation({ ...newReservation, customerName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      if (date) {
                        setNewReservation({
                          ...newReservation,
                          date: date.toISOString().split('T')[0],
                        });
                      }
                    }}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Time</label>
                  <Input
                    type="time"
                    value={newReservation.time}
                    onChange={(e) =>
                      setNewReservation({ ...newReservation, time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Party Size</label>
                  <Input
                    type="number"
                    min="1"
                    value={newReservation.partySize}
                    onChange={(e) =>
                      setNewReservation({
                        ...newReservation,
                        partySize: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Table Number</label>
                  <Input
                    type="number"
                    min="1"
                    value={newReservation.tableNumber}
                    onChange={(e) =>
                      setNewReservation({
                        ...newReservation,
                        tableNumber: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Input
                    value={newReservation.notes}
                    onChange={(e) =>
                      setNewReservation({ ...newReservation, notes: e.target.value })
                    }
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    if (
                      isTimeSlotAvailable(
                        newReservation.time,
                        newReservation.date,
                        newReservation.tableNumber
                      )
                    ) {
                      onAddReservation(newReservation);
                      setNewReservation({
                        customerName: "",
                        date: new Date().toISOString().split('T')[0],
                        time: "18:00",
                        partySize: 2,
                        tableNumber: 1,
                        status: "pending",
                        notes: "",
                      });
                    }
                  }}
                >
                  Add Reservation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Reservations</p>
                <p className="text-2xl font-bold">
                  {
                    reservations.filter(
                      (r) =>
                        r.date === new Date().toISOString().split('T')[0] &&
                        r.status !== "cancelled"
                    ).length
                  }
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Guests Today</p>
                <p className="text-2xl font-bold">
                  {reservations
                    .filter(
                      (r) =>
                        r.date === new Date().toISOString().split('T')[0] &&
                        r.status !== "cancelled"
                    )
                    .reduce((sum, r) => sum + r.partySize, 0)}
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
      </Card>
    </div>
  );
};
