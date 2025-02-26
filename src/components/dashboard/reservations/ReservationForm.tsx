
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import type { Reservation } from "@/types/staff";

interface ReservationFormProps {
  newReservation: Omit<Reservation, "id">;
  selectedDate: Date | undefined;
  onReservationChange: (reservation: Omit<Reservation, "id">) => void;
  onDateSelect: (date: Date | undefined) => void;
  onSubmit: () => void;
}

export const ReservationForm = ({
  newReservation,
  selectedDate,
  onReservationChange,
  onDateSelect,
  onSubmit,
}: ReservationFormProps) => {
  return (
    <div className="space-y-4 mt-4">
      <div>
        <label className="text-sm font-medium">Customer Name</label>
        <Input
          value={newReservation.customerName}
          onChange={(e) =>
            onReservationChange({ ...newReservation, customerName: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            onDateSelect(date);
            if (date) {
              onReservationChange({
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
            onReservationChange({ ...newReservation, time: e.target.value })
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
            onReservationChange({
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
            onReservationChange({
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
            onReservationChange({ ...newReservation, notes: e.target.value })
          }
        />
      </div>
      <Button className="w-full" onClick={onSubmit}>
        Add Reservation
      </Button>
    </div>
  );
};
