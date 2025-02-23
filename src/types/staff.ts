
export interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: "active" | "on_break" | "off_duty";
  shift: string;
}

export interface Shift {
  id: number;
  staffId: number;
  date: string;
  time: string;
}
