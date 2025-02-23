
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { StaffMember, Shift } from "@/types/staff"

interface ScheduleViewProps {
  shifts: Shift[]
  staff: StaffMember[]
}

export const ScheduleView = ({ shifts, staff }: ScheduleViewProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Staff Member</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Shift Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shifts.map((shift) => {
          const staffMember = staff.find((s) => s.id === shift.staffId);
          return (
            <TableRow key={shift.id}>
              <TableCell>{staffMember?.name}</TableCell>
              <TableCell>{shift.date}</TableCell>
              <TableCell>{shift.time}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  )
}
