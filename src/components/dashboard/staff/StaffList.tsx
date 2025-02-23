
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import type { StaffMember } from "@/types/staff";

interface StaffListProps {
  staff: StaffMember[];
  onUpdateStatus: (staffId: number, status: StaffMember["status"]) => void;
  onSelectStaff: (staffId: number) => void;
  calculateAttendance: (staffId: number) => number;
}

export const StaffList = ({
  staff,
  onUpdateStatus,
  onSelectStaff,
  calculateAttendance,
}: StaffListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Attendance</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{member.role}</Badge>
            </TableCell>
            <TableCell>
              <Select
                value={member.status}
                onValueChange={(value: StaffMember["status"]) =>
                  onUpdateStatus(member.id, value)
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on_break">On Break</SelectItem>
                  <SelectItem value="off_duty">Off Duty</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={calculateAttendance(member.id)} className="w-[60px]" />
                <span className="text-sm">{calculateAttendance(member.id)}%</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectStaff(member.id)}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
