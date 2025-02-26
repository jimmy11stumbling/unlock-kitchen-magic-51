
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import type { Reservation } from "@/types/staff";
import { CalendarDays } from "lucide-react";
import { ReservationMetrics } from "./reservations/ReservationMetrics";
import { ReservationForm } from "./reservations/ReservationForm";
import { ReservationTable } from "./reservations/ReservationTable";
import { getStatusColor, isTimeSlotAvailable } from "./reservations/utils";

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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const handleAddReservation = () => {
    if (
      isTimeSlotAvailable(
        newReservation.time,
        newReservation.date,
        newReservation.tableNumber,
        reservations
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
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
              <ReservationForm
                newReservation={newReservation}
                selectedDate={selectedDate}
                onReservationChange={setNewReservation}
                onDateSelect={setSelectedDate}
                onSubmit={handleAddReservation}
              />
            </DialogContent>
          </Dialog>
        </div>

        <ReservationMetrics reservations={reservations} />
        <ReservationTable
          reservations={reservations}
          onUpdateStatus={onUpdateStatus}
          getStatusColor={getStatusColor}
        />
      </Card>
    </div>
  );
};
