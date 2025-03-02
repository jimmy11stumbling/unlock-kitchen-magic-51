
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, MoreHorizontal, Search, User } from "lucide-react";
import type { StaffMember, StaffStatus } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";

interface StaffListProps {
  staff: StaffMember[];
  onUpdateStatus: (staffId: number, status: StaffStatus) => void;
  onSelectStaff: (staffId: number) => void;
  calculateAttendance: (staffId: number) => number;
}

export const StaffList = ({ 
  staff,
  onUpdateStatus,
  onSelectStaff,
  calculateAttendance
}: StaffListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStatusChange = (staffId: number, newStatus: StaffStatus) => {
    onUpdateStatus(staffId, newStatus);
    const member = staff.find(m => m.id === staffId);
    toast({
      title: "Status Updated",
      description: `${member?.name}'s status is now ${newStatus.replace('_', ' ')}`
    });
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? member.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  const roles = Array.from(new Set(staff.map(member => member.role)));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              {roleFilter ? `Role: ${roleFilter}` : "Filter by role"}
              <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => setRoleFilter(null)}>
              <Check className={`mr-2 h-4 w-4 ${!roleFilter ? 'opacity-100' : 'opacity-0'}`} />
              All Roles
            </DropdownMenuItem>
            {roles.map((role) => (
              <DropdownMenuItem key={role} onClick={() => setRoleFilter(role)}>
                <Check className={`mr-2 h-4 w-4 ${roleFilter === role ? 'opacity-100' : 'opacity-0'}`} />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredStaff.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <User className="mx-auto h-10 w-10 text-muted-foreground opacity-50" />
          <p className="mt-2 text-muted-foreground">No staff members found</p>
        </div>
      ) : (
        <div className="border rounded-md">
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
              {filteredStaff.map((member) => (
                <TableRow key={member.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell onClick={() => onSelectStaff(member.id)}>
                    <div className="font-medium">{member.name}</div>
                    {member.email && (
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    )}
                  </TableCell>
                  <TableCell onClick={() => onSelectStaff(member.id)}>
                    <Badge variant="outline" className="capitalize">
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={() => onSelectStaff(member.id)}>
                    <Badge 
                      className={
                        member.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                        member.status === "on_break" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" :
                        "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }
                    >
                      {member.status === "on_break" ? "On Break" : member.status === "off_duty" ? "Off Duty" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell onClick={() => onSelectStaff(member.id)}>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${calculateAttendance(member.id)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {calculateAttendance(member.id)}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelectStaff(member.id)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(member.id, "active")}>
                          Set Active
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(member.id, "on_break")}>
                          Set On Break
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(member.id, "off_duty")}>
                          Set Off Duty
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
