
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, UserCog, ShieldAlert } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";
import { hasAdminAccess } from "@/hooks/dashboard/staff/services/queries/staffQueries";

interface StaffListProps {
  staff: StaffMember[];
  onUpdateStatus: (staffId: number, status: StaffMember["status"]) => void;
  onSelectStaff: (staffId: number) => void;
  calculateAttendance: (staffId: number) => number;
  currentUser?: StaffMember | null;
}

export const StaffList = ({
  staff,
  onUpdateStatus,
  onSelectStaff,
  calculateAttendance,
  currentUser
}: StaffListProps) => {
  const { toast } = useToast();
  const isAdmin = hasAdminAccess(currentUser);

  const handleStatusUpdate = async (staffId: number, status: StaffMember["status"]) => {
    try {
      if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "Only managers can update staff status",
          variant: "destructive",
        });
        return;
      }

      await onUpdateStatus(staffId, status);
      const member = staff.find(m => m.id === staffId);
      toast({
        title: "Status Updated",
        description: `${member?.name}'s status has been updated to ${status.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update staff member's status",
        variant: "destructive",
      });
    }
  };

  const handleStaffSelect = (staffId: number, action: 'schedule' | 'details') => {
    try {
      if (action === 'details' && !isAdmin) {
        toast({
          title: "Access Denied",
          description: "Only managers can view detailed staff information",
          variant: "destructive",
        });
        return;
      }

      onSelectStaff(staffId);
      const member = staff.find(m => m.id === staffId);
      toast({
        title: `Viewing ${action === 'schedule' ? 'Schedule' : 'Details'}`,
        description: `Now viewing ${member?.name}'s ${action === 'schedule' ? 'schedule' : 'details'}`,
      });
    } catch (error) {
      console.error('Error selecting staff member:', error);
      toast({
        title: "Error",
        description: `Failed to view staff member's ${action}`,
        variant: "destructive",
      });
    }
  };

  if (!staff || staff.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No staff members found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Attendance</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staff.map((member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                {member.role === 'manager' && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <ShieldAlert className="h-4 w-4 text-primary" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Manager
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {member.name}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{member.role}</Badge>
            </TableCell>
            <TableCell>
              <Select
                value={member.status}
                onValueChange={(value: StaffMember["status"]) =>
                  handleStatusUpdate(member.id, value)
                }
                disabled={!isAdmin}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select status" />
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
                <Progress 
                  value={calculateAttendance(member.id)} 
                  className="w-[60px]"
                  max={100}
                />
                <span className="text-sm">{calculateAttendance(member.id)}%</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStaffSelect(member.id, 'schedule')}
                  className="flex items-center gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Schedule
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStaffSelect(member.id, 'details')}
                  className="flex items-center gap-2"
                  disabled={!isAdmin}
                >
                  <UserCog className="h-4 w-4" />
                  Details
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
