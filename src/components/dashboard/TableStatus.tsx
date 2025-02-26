
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { LayoutGrid } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TableData {
  id: number;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  section: string;
}

export function TableStatus() {
  const [tables, setTables] = useState<TableData[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchTableStatus();
    subscribeToTableUpdates();
  }, []);

  const subscribeToTableUpdates = () => {
    const channel = supabase
      .channel('table-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tables'
        },
        () => {
          fetchTableStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchTableStatus = async () => {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .order('number', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch table status",
        variant: "destructive",
      });
      return;
    }

    setTables(data || []);
  };

  const getStatusColor = (status: TableData['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      case 'cleaning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTableCountByStatus = (status: TableData['status']) => {
    return tables.filter(table => table.status === status).length;
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Table Status</h3>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">
            Available: {getTableCountByStatus('available')}
          </Badge>
          <Badge variant="destructive">
            Occupied: {getTableCountByStatus('occupied')}
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className="p-3 border rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Table {table.number}</span>
              <Badge className={getStatusColor(table.status)}>
                {table.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Capacity: {table.capacity} seats</p>
              <p>Section: {table.section}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
