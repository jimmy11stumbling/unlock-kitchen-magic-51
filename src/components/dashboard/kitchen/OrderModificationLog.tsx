
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Clock } from "lucide-react";

interface ModificationEntry {
  id: number;
  timestamp: string;
  type: 'status' | 'course' | 'priority' | 'notes';
  user: string;
  details: string;
}

interface OrderModificationLogProps {
  modifications: ModificationEntry[];
}

export function OrderModificationLog({ modifications }: OrderModificationLogProps) {
  const getModificationColor = (type: ModificationEntry['type']) => {
    switch (type) {
      case 'status': return 'bg-blue-100 text-blue-800';
      case 'course': return 'bg-green-100 text-green-800';
      case 'priority': return 'bg-red-100 text-red-800';
      case 'notes': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5" />
        <h3 className="font-semibold">Modification History</h3>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-3">
          {modifications.map((entry) => (
            <div key={entry.id} className="flex items-start gap-3 p-3 border rounded-lg">
              <Badge className={getModificationColor(entry.type)}>
                {entry.type}
              </Badge>
              <div className="flex-1">
                <p className="text-sm">{entry.details}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  <span>by {entry.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
