import { useState } from 'react';
import { Shift } from '@/types';

export const useShiftManagement = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);

  const addShift = (shiftData: Omit<Shift, 'id'>) => {
    const newShift: Shift = {
      id: Date.now(),
      staffId: shiftData.staffId,
      startTime: shiftData.startTime,
      endTime: shiftData.endTime,
      date: shiftData.date,
      status: shiftData.status,
    };
    setShifts([...shifts, newShift]);
  };

  return {
    shifts,
    addShift,
  };
};
