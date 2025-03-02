
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StaffMember } from "@/types/staff";

interface AddStaffDialogProps {
  open: boolean;
  onClose: () => void;
  onAddStaff: (data: Omit<StaffMember, "id" | "status">) => Promise<StaffMember>;
}

export const AddStaffDialog = ({ open, onClose, onAddStaff }: AddStaffDialogProps) => {
  const [formData, setFormData] = useState<Omit<StaffMember, "id" | "status">>({
    name: "",
    role: "server",
    shift: "morning",
    salary: 35000,
    hireDate: new Date().toISOString().split('T')[0], // Current date as default hire date
    email: "",
    phone: "",
    address: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    startDate: new Date().toISOString().split('T')[0],
    department: "service",
    certifications: [],
    notes: "",
    bankInfo: {
      accountType: "checking",
      accountNumber: "",
      routingNumber: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact!,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onAddStaff(formData);
      onClose();
    } catch (error) {
      console.error("Error adding staff:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="chef">Chef</SelectItem>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="bartender">Bartender</SelectItem>
                <SelectItem value="host">Host</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) => handleChange("salary", Number(e.target.value))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="hireDate">Hire Date</Label>
            <Input
              id="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={(e) => handleChange("hireDate", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="col-span-2 space-y-2 mt-2">
            <h3 className="font-medium">Emergency Contact</h3>
            <div className="grid grid-cols-3 gap-x-4">
              <div className="space-y-1">
                <Label htmlFor="emergency-name">Name</Label>
                <Input
                  id="emergency-name"
                  value={formData.emergencyContact?.name || ""}
                  onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="emergency-phone">Phone</Label>
                <Input
                  id="emergency-phone"
                  value={formData.emergencyContact?.phone || ""}
                  onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="emergency-relationship">Relationship</Label>
                <Input
                  id="emergency-relationship"
                  value={formData.emergencyContact?.relationship || ""}
                  onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Staff Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
