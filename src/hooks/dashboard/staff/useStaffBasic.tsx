
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStaffAuth } from "./hooks/useStaffAuth";
import { useStaffManagement } from "./hooks/useStaffManagement";
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
