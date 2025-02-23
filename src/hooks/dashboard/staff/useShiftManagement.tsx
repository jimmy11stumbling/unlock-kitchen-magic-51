
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Shift } from "@/types/staff";

const initialShifts: Shift[] = [
  {
    id: 1,
    staffId: 1,
    date: new Date().toISOString().split('T')[0],
    time: "14:00-22:00"
  },
  {
    id: 2,
    staffId: 2,
    date: new Date().toISOString().split('T')[0],
    time: "06:00-14:00"
  },
  {
    id: 3,
    staffId: 3,
    date: new Date().toISOString().split('T')[0],
    time: "16:00-24:00"
  },
  {
    id: 4,
    staffId: 4,
    date: new Date().toISOString().split('T')[0],
    time: "16:00-24:00"
  },
  {
    id: 5,
    staffId: 5,
    date: new Date().toISOString().split('T')[0],
    time: "15:00-23:00"
  }
];

export const useShiftManagement = () => {
  const { toast } = useToast();
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);

  const addShift = (staffId: number, date: string, time: string) => {
    const hasOverlap = shifts.some(
      shift => shift.staffId === staffId && shift.date === date && shift.time === time
    );

    if (hasOverlap) {
      toast({
        title: "Schedule conflict",
        description: "This staff member already has a shift during this time.",
        variant: "destructive",
      });
      return;
    }

    const newShift: Shift = {
      id: shifts.length + 1,
      staffId,
      date,
      time,
    };

    setShifts([...shifts, newShift]);
    toast({
      title: "Shift added",
      description: `New shift added for staff ID ${staffId} on ${date}.`,
    });
  };

  return {
    shifts,
    addShift,
  };
};
