
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { TableLayout } from "@/types/staff";

export const useTableState = () => {
  const { toast } = useToast();
  const [tables, setTables] = useState<TableLayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('tables')
          .select('*')
          .order('number', { ascending: true });

        if (supabaseError) throw supabaseError;

        const mappedTables: TableLayout[] = data.map(table => ({
          id: table.id,
          number: table.number,
          capacity: table.capacity,
          status: table.status,
          section: table.section,
        }));

        setTables(mappedTables);
        setError(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Could not load tables";
        setError(message);
        console.error('Error fetching tables:', error);
        toast({
          title: "Error fetching tables",
          description: message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Set up real-time subscription
    const channel = supabase
      .channel('table-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tables'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTables(prev => [...prev, {
              id: payload.new.id,
              number: payload.new.number,
              capacity: payload.new.capacity,
              status: payload.new.status,
              section: payload.new.section,
            }]);
          } else if (payload.eventType === 'UPDATE') {
            setTables(prev => prev.map(table =>
              table.id === payload.new.id
                ? {
                    id: payload.new.id,
                    number: payload.new.number,
                    capacity: payload.new.capacity,
                    status: payload.new.status,
                    section: payload.new.section,
                  }
                : table
            ));
          } else if (payload.eventType === 'DELETE') {
            setTables(prev => prev.filter(table => table.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    fetchTables();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const addTable = async (table: Omit<TableLayout, "id">) => {
    try {
      const { error } = await supabase
        .from('tables')
        .insert([{
          number: table.number,
          capacity: table.capacity,
          status: table.status,
          section: table.section,
        }]);

      if (error) throw error;

      toast({
        title: "Table Added",
        description: `Table ${table.number} has been added successfully.`,
      });
    } catch (error) {
      console.error('Error adding table:', error);
      toast({
        title: "Error adding table",
        description: error instanceof Error ? error.message : "Could not add table",
        variant: "destructive"
      });
    }
  };

  const updateTableStatus = async (tableId: number, status: TableLayout["status"]) => {
    try {
      const { error } = await supabase
        .from('tables')
        .update({ status })
        .eq('id', tableId);

      if (error) throw error;

      toast({
        title: "Table Status Updated",
        description: `Table status has been updated to ${status}.`,
      });
    } catch (error) {
      console.error('Error updating table status:', error);
      toast({
        title: "Error updating table",
        description: error instanceof Error ? error.message : "Could not update table status",
        variant: "destructive"
      });
    }
  };

  return {
    tables,
    isLoading,
    error,
    addTable,
    updateTableStatus,
  };
};
