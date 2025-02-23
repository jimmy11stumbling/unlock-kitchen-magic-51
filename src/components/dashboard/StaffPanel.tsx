
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { StaffTable } from "./StaffTable";
import { AddStaffForm } from "./AddStaffForm";
import type { StaffMember } from "@/types/staff";

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
  return (
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
        onAddShift={onAddShift}
      />
    </Card>
  );
};
