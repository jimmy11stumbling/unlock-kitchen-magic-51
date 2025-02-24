
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface AddShiftFormProps {
  onAddShift: (date: string, time: string) => void;
}

export const AddShiftForm = ({ onAddShift }: AddShiftFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [shiftTime, setShiftTime] = useState("09:00-17:00");

  const handleAddShift = () => {
    onAddShift(
      selectedDate.toISOString().split('T')[0],
      shiftTime
    );
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Add New Shift</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Select Date</label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Shift Time</label>
          <Select value={shiftTime} onValueChange={setShiftTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select shift time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="09:00-17:00">9:00 AM - 5:00 PM</SelectItem>
              <SelectItem value="10:00-18:00">10:00 AM - 6:00 PM</SelectItem>
              <SelectItem value="14:00-22:00">2:00 PM - 10:00 PM</SelectItem>
              <SelectItem value="18:00-02:00">6:00 PM - 2:00 AM</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddShift} className="w-full">
          Add Shift
        </Button>
      </div>
    </Card>
  );
};
