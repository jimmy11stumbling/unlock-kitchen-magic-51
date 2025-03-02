
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export const EmptyScheduleCard = () => {
  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Info className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Staff Member Selected</h3>
        <p className="text-muted-foreground mb-4">
          Select a staff member from the list to view and manage their information
        </p>
      </div>
    </Card>
  );
};
