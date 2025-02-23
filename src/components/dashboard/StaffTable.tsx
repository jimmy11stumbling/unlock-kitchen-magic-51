
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { StaffMember } from "@/types/staff";

interface StaffTableProps {
  staff: StaffMember[];
  onUpdateStatus: (staffId: number, newStatus: StaffMember["status"]) => void;
  onAddShift: (staffId: number, date: string, time: string) => void;
}

export const StaffTable = ({ staff, onUpdateStatus, onAddShift }: StaffTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Current Shift</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.map((member) => (
          <TableRow key={member.id}>
            <TableCell>{member.name}</TableCell>
            <TableCell>{member.role}</TableCell>
            <TableCell>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                member.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                member.status === "on_break" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
              }`}>
                {member.status === "active" ? (
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                ) : member.status === "on_break" ? (
                  <Clock className="w-3 h-3 mr-1" />
                ) : (
                  <XCircle className="w-3 h-3 mr-1" />
                )}
                {member.status.replace("_", " ")}
              </span>
            </TableCell>
            <TableCell>{member.shift}</TableCell>
            <TableCell className="text-right">
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateStatus(member.id, member.status === "active" ? "on_break" : "active")}
                >
                  {member.status === "active" ? "Set Break" : "Set Active"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onAddShift(member.id, "2024-02-21", "9:00 AM - 5:00 PM")}
                >
                  Add Shift
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
