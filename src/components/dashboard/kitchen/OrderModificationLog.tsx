
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface Modification {
  id: number;
  timestamp: string;
  type: 'status' | 'priority' | 'item' | 'coursing' | 'chef';
  user: string;
  details: string;
}

interface OrderModificationLogProps {
  modifications: Modification[];
}

export function OrderModificationLog({ modifications }: OrderModificationLogProps) {
  if (!modifications.length) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        No modification history available
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {modifications.map((mod) => (
          <div key={mod.id} className="pb-4 border-b last:border-b-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">
                {mod.type.charAt(0).toUpperCase() + mod.type.slice(1)} Change
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(mod.timestamp), 'h:mm a, MMM dd')}
              </span>
            </div>
            <p className="text-sm">{mod.details}</p>
            <div className="flex items-center mt-1">
              <span className="text-xs text-muted-foreground">
                By: {mod.user}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
