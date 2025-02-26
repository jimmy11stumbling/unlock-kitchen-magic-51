import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { Shift } from "@/types/staff";

export const useShiftManagement = () => {
  const { toast } = useToast();
  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: 1,
      staffId: 1,
      date: new Date().toISOString().split('T')[0],
      startTime: "14:00",
      endTime: "22:00",
      status: "scheduled"
    },
    {
      id: 2,
      staffId: 2,
      date: new Date().toISOString().split('T')[0],
      startTime: "06:00",
      endTime: "14:00",
      status: "scheduled"
    },
    {
      id: 3,
      staffId: 3,
      date: new Date().toISOString().split('T')[0],
      startTime: "16:00",
      endTime: "24:00",
      status: "scheduled"
    },
    {
      id: 4,
      staffId: 4,
      date: new Date().toISOString().split('T')[0],
      startTime: "16:00",
      endTime: "24:00",
      status: "scheduled"
    },
    {
      id: 5,
      staffId: 5,
      date: new Date().toISOString().split('T')[0],
      startTime: "15:00",
      endTime: "23:00",
      status: "scheduled"
    }
  ]);

  const addShift = (staffId: number, date: string, startTime: string, endTime: string) => {
    const hasOverlap = shifts.some(
      shift => shift.staffId === staffId && 
               shift.date === date && 
               ((startTime >= shift.startTime && startTime < shift.endTime) ||
                (endTime > shift.startTime && endTime <= shift.endTime))
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
      startTime,
      endTime,
      status: "scheduled"
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
