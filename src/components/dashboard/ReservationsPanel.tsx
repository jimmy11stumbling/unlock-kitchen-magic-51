import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useDashboardState } from "@/hooks/useDashboardState";
import { addDays } from "date-fns";
import type { Reservation } from "@/types/staff";

export const ReservationsPanel = () => {
  const { reservations, addReservation, updateReservationStatus } = useDashboardState();
  const { toast } = useToast();
  const tomorrow = addDays(new Date(), 1);

  // Remove createdAt property
  const [newReservation, setNewReservation] = useState<Omit<Reservation, "id">>({
    customerName: "",
    date: tomorrow.toISOString().split('T')[0],
    time: "18:00",
    partySize: 2,
    tableNumber: 1,
    status: "pending",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReservation(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseInt(value);
    setNewReservation(prev => ({ ...prev, [name]: isNaN(parsedValue) ? 0 : parsedValue }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewReservation(prev => ({ ...prev, date: date.toISOString().split('T')[0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReservation(newReservation);
    resetForm();
  };

  // Fix resetForm by removing createdAt
  const resetForm = () => {
    setNewReservation({
      customerName: "",
      date: tomorrow.toISOString().split('T')[0],
      time: "18:00",
      partySize: 2,
      tableNumber: 1,
      status: "pending",
      notes: ""
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Reservations</h2>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium">Add Reservation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={newReservation.customerName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Calendar
                  mode="single"
                  selected={new Date(newReservation.date)}
                  onSelect={handleDateChange}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  type="time"
                  id="time"
                  name="time"
                  value={newReservation.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="partySize">Party Size</Label>
                <Input
                  type="number"
                  id="partySize"
                  name="partySize"
                  value={newReservation.partySize}
                  onChange={handleNumberInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tableNumber">Table Number</Label>
                <Input
                  type="number"
                  id="tableNumber"
                  name="tableNumber"
                  value={newReservation.tableNumber}
                  onChange={handleNumberInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  type="text"
                  id="status"
                  name="status"
                  value={newReservation.status}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
            </div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={newReservation.notes}
              onChange={handleInputChange}
              placeholder="Special requests or notes"
            />
            <Button type="submit">Add Reservation</Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Reservation List */}
      <h3 className="text-lg font-medium">Current Reservations</h3>
      {reservations.length === 0 ? (
        <p className="text-muted-foreground">No reservations yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="shadow-sm">
              <CardContent className="p-4">
                <h4 className="font-semibold">{reservation.customerName}</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                </p>
                <p className="text-sm">Party Size: {reservation.partySize}</p>
                <p className="text-sm">Table: {reservation.tableNumber}</p>
                <p className="text-sm">Status: {reservation.status}</p>
                {reservation.notes && (
                  <p className="text-sm mt-2">Notes: {reservation.notes}</p>
                )}
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateReservationStatus(reservation.id, "confirmed")}
                  >
                    Confirm
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
