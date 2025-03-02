import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { StaffMember } from "@/types/staff";

interface AddStaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStaff: (staff: Omit<StaffMember, "id" | "status">) => Promise<StaffMember>;
}

export function AddStaffDialog({ 
  open, 
  onOpenChange, 
  onAddStaff 
}: AddStaffDialogProps) {
  const defaultValues: Omit<StaffMember, "id" | "status"> = {
    name: "",
    role: "server",
    email: "",
    phone: "",
    salary: 0,
    hireDate: new Date().toISOString().split('T')[0],
    department: "service",
    schedule: {},
    address: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    certifications: [],
    notes: "",
    payrollSettings: {
      accountNumber: "",
      routingNumber: "",
    },
  };
  
  const [newStaff, setNewStaff] = useState<Omit<StaffMember, "id" | "status">>(defaultValues);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setNewStaff((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onAddStaff(newStaff);
      onOpenChange(false);
      setNewStaff(defaultValues);
    } catch (error) {
      console.error("Error adding staff:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Staff Member</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              type="text"
              id="name"
              value={newStaff.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select
              value={newStaff.role}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="chef">Chef</SelectItem>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="bartender">Bartender</SelectItem>
                <SelectItem value="host">Host</SelectItem>
                <SelectItem value="kitchen_staff">Kitchen Staff</SelectItem>
                <SelectItem value="cleaner">Cleaner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              value={newStaff.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              type="tel"
              id="phone"
              value={newStaff.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="salary" className="text-right">
              Salary
            </Label>
            <Input
              type="number"
              id="salary"
              value={newStaff.salary}
              onChange={(e) => handleChange("salary", Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hireDate" className="text-right">
              Hire Date
            </Label>
            <Input
              type="date"
              id="hireDate"
              value={newStaff.hireDate}
              onChange={(e) => handleChange("hireDate", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Input
              type="text"
              id="department"
              value={newStaff.department}
              onChange={(e) => handleChange("department", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="shift" className="text-right">
              Shift
            </Label>
            <Input
              type="text"
              id="shift"
              value={newStaff.shift || ''}
              onChange={(e) => handleChange("shift", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              type="text"
              id="address"
              value={newStaff.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="emergencyContactName" className="text-right">
              Emergency Contact Name
            </Label>
            <Input
              type="text"
              id="emergencyContactName"
              value={newStaff.emergencyContact?.name}
              onChange={(e) => handleChange("emergencyContact", { ...newStaff.emergencyContact, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="emergencyContactPhone" className="text-right">
              Emergency Contact Phone
            </Label>
            <Input
              type="tel"
              id="emergencyContactPhone"
              value={newStaff.emergencyContact?.phone}
              onChange={(e) => handleChange("emergencyContact", { ...newStaff.emergencyContact, phone: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="emergencyContactRelationship" className="text-right">
              Emergency Contact Relationship
            </Label>
            <Input
              type="text"
              id="emergencyContactRelationship"
              value={newStaff.emergencyContact?.relationship}
              onChange={(e) => handleChange("emergencyContact", { ...newStaff.emergencyContact, relationship: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="certifications" className="text-right">
              Certifications
            </Label>
            <Input
              type="text"
              id="certifications"
              value={newStaff.certifications?.join(', ') || ''}
              onChange={(e) => handleChange("certifications", e.target.value.split(',').map(s => s.trim()))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Input
              type="text"
              id="notes"
              value={newStaff.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Staff"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
