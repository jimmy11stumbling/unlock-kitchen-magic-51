
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderDetailsProps {
  tableNumber: number;
  guestCount: number;
  specialInstructions: string;
  onTableNumberChange: (value: number) => void;
  onGuestCountChange: (value: number) => void;
  onSpecialInstructionsChange: (value: string) => void;
}

export const OrderDetails = ({
  tableNumber,
  guestCount,
  specialInstructions,
  onTableNumberChange,
  onGuestCountChange,
  onSpecialInstructionsChange,
}: OrderDetailsProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tableNumber">Table Number</Label>
          <Input
            id="tableNumber"
            type="number"
            min="1"
            value={tableNumber}
            onChange={(e) => onTableNumberChange(parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guestCount">Number of Guests</Label>
          <Input
            id="guestCount"
            type="number"
            min="1"
            value={guestCount}
            onChange={(e) => onGuestCountChange(parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialInstructions">Special Instructions</Label>
        <Input
          id="specialInstructions"
          value={specialInstructions}
          onChange={(e) => onSpecialInstructionsChange(e.target.value)}
          placeholder="Allergies, preferences, etc."
        />
      </div>
    </div>
  );
};
