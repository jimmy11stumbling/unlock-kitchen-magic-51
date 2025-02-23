
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";

export const usePerformanceManagement = () => {
  const { toast } = useToast();

  const updateStaffPerformance = async (staffId: number, rating: number, notes: string) => {
    try {
      const { error } = await supabase
        .from('staff_members')
        .update({
          performance_rating: rating,
          notes: notes
        })
        .eq('id', staffId);

      if (error) throw error;

      toast({
        title: "Performance updated",
        description: "Staff member's performance review has been updated.",
      });
    } catch (error) {
      console.error('Error updating performance:', error);
      toast({
        title: "Error updating performance",
        description: "There was a problem updating the performance review.",
        variant: "destructive",
      });
    }
  };

  const updateStaffSchedule = async (staffId: number, schedule: StaffMember["schedule"]) => {
    try {
      const { error } = await supabase
        .from('staff_members')
        .update({ schedule })
        .eq('id', staffId);

      if (error) throw error;

      toast({
        title: "Schedule updated",
        description: "Staff member's schedule has been updated.",
      });
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast({
        title: "Error updating schedule",
        description: "There was a problem updating the schedule.",
        variant: "destructive",
      });
    }
  };

  const updateCertifications = async (staffId: number, certifications: string[]) => {
    try {
      const { error } = await supabase
        .from('staff_members')
        .update({ certifications })
        .eq('id', staffId);

      if (error) throw error;

      toast({
        title: "Certifications updated",
        description: "Staff member's certifications have been updated.",
      });
    } catch (error) {
      console.error('Error updating certifications:', error);
      toast({
        title: "Error updating certifications",
        description: "There was a problem updating the certifications.",
        variant: "destructive",
      });
    }
  };

  return {
    updateStaffPerformance,
    updateStaffSchedule,
    updateCertifications
  };
};
