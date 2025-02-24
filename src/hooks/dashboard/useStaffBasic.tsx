
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStaffAuth } from "./staff/hooks/useStaffAuth";
import { useStaffManagement } from "./staff/hooks/useStaffManagement";
import { useShiftManagement } from "./staff/useShiftManagement";
import { usePerformanceManagement } from "./staff/usePerformanceManagement";
import type { StaffMember } from "@/types/staff";

export const useStaffBasic = (currentUser: StaffMember | null = null) => {
  const auth = useStaffAuth(currentUser);
  const management = useStaffManagement();

  useEffect(() => {
    management.fetchStaff();

    const channel = supabase
      .channel('staff-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'staff_members' },
        (payload) => {
          console.log('Real-time update received:', payload);
          management.fetchStaff();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    ...auth,
    ...management,
  };
};
