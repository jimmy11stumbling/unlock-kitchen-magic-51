
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StaffTable } from "./StaffTable";
import { AddStaffForm } from "./AddStaffForm";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StaffMember } from "@/types/staff";
import { useState } from "react";

interface StaffPanelProps {
  staff: StaffMember[];
  onAddStaff: (data: { name: string; role: string; salary: string }) => void;
  onUpdateStatus: (staffId: number, status: StaffMember["status"]) => void;
  onAddShift: (staffId: number, date: string, time: string) => void;
}

export const StaffPanel = ({
  staff,
  onAddStaff,
  onUpdateStatus,
  onAddShift,
}: StaffPanelProps) => {
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  const handleShiftAssignment = (staffId: number, date: string, time: string) => {
    onAddShift(staffId, date, time);
    setSelectedStaffId(null);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Staff Management</h2>
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Staff Member</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <AddStaffForm onSubmit={onAddStaff} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <StaffTable
          staff={staff}
          onUpdateStatus={onUpdateStatus}
          onAddShift={(staffId) => setSelectedStaffId(staffId)}
        />
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Schedule Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                Assign Shift
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign New Shift</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Staff Member</label>
                  <Select onValueChange={(value) => setSelectedStaffId(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((member) => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" onChange={(e) => console.log(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (6 AM - 2 PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (2 PM - 10 PM)</SelectItem>
                      <SelectItem value="night">Night (10 PM - 6 AM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={() => handleShiftAssignment(selectedStaffId!, "2024-03-20", "morning")}>
                  Assign Shift
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  );
};
