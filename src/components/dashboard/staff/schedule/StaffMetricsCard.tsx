
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import type { StaffMember } from "@/types/staff";

interface StaffMetricsCardProps {
  selectedStaff: StaffMember;
  calculateWeeklyHours: (staffId: number) => number;
}

export const StaffMetricsCard = ({ selectedStaff, calculateWeeklyHours }: StaffMetricsCardProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="font-semibold mb-4">Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Salary</p>
            <p className="text-lg font-medium">${selectedStaff.salary?.toLocaleString()}/year</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Weekly Hours</p>
            <p className="text-lg font-medium">{calculateWeeklyHours(selectedStaff.id)} hours</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <p className="text-lg font-medium">Direct Deposit</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Last Payment</p>
            <p className="text-lg font-medium">June 15, 2023</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
