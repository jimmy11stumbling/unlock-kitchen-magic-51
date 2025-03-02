
// Fix only the calculateWeeklyHours function to handle unknown types
const calculateWeeklyHours = (staffId: number): number => {
  const staffMember = staff.find(s => s.id === staffId);
  if (!staffMember?.schedule) return 0;
  
  // Calculate hours from the schedule with proper type checking
  return Object.entries(staffMember.schedule)
    .filter(([_, time]) => typeof time === 'string' && time !== "OFF")
    .reduce((total, [_, time]) => {
      if (typeof time !== 'string' || !time.includes("-")) return total;
      const [start, end] = time.split("-");
      const startHour = parseInt(start.split(":")[0]);
      const endHour = parseInt(end.split(":")[0]);
      return total + (endHour > startHour ? endHour - startHour : 24 - startHour + endHour);
    }, 0);
};
