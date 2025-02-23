
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, UserPlus } from "lucide-react";
import type { StaffMember } from "@/types/staff";

interface AddStaffDialogProps {
  onAddStaff: (data: Omit<StaffMember, "id" | "status">) => void;
}

export const AddStaffDialog = ({ onAddStaff }: AddStaffDialogProps) => {
  const [newStaff, setNewStaff] = useState({ name: "", role: "", salary: "" });

  const handleAddStaff = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const completeStaffData: Omit<StaffMember, "id" | "status"> = {
      name: newStaff.name,
      role: newStaff.role,
      salary: newStaff.salary,
      shift: "Morning",
      email: "",
      phone: "",
      address: "",
      emergencyContact: {
        name: "",
        phone: "",
        relationship: ""
      },
      startDate: currentDate,
      department: newStaff.role,
      certifications: [],
      performanceRating: 0,
      notes: "",
      schedule: {
        monday: "OFF",
        tuesday: "OFF",
        wednesday: "OFF",
        thursday: "OFF",
        friday: "OFF",
        saturday: "OFF",
        sunday: "OFF"
      },
      bankInfo: {
        accountNumber: "",
        routingNumber: "",
        accountType: "checking"
      }
    };

    onAddStaff(completeStaffData);
    setNewStaff({ name: "", role: "", salary: "" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              placeholder="Staff member name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <Select
              value={newStaff.role}
              onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chef">Chef</SelectItem>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="host">Host</SelectItem>
                <SelectItem value="bartender">Bartender</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Salary</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                value={newStaff.salary}
                onChange={(e) => setNewStaff({ ...newStaff, salary: e.target.value })}
                placeholder="Annual salary"
                className="pl-10"
                type="number"
              />
            </div>
          </div>
          <Button onClick={handleAddStaff} className="w-full">
            Add Staff Member
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
