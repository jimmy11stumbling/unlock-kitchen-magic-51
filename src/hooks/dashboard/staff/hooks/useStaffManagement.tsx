import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember, StaffStatus } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";
import { staffMappers } from "../utils/staffMapper";

interface UseStaffManagementProps {
  initialStaff: StaffMember[];
}

export const useStaffManagement = ({ initialStaff }: UseStaffManagementProps = { initialStaff: [] }) => {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const { toast } = useToast();

  useEffect(() => {
    setStaff(initialStaff);
  }, [initialStaff]);

  const fetchStaff = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*');

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        // Parse schedule and certifications for each staff member
        const mappedStaff = data.map(staffMember => ({
          ...staffMember,
          schedule: staffMappers.parseSchedule(staffMember.schedule),
          certifications: staffMappers.parseCertifications(staffMember.certifications)
        })) as StaffMember[];
        setStaff(mappedStaff);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching staff",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  const addStaff = async (newStaffData: Omit<StaffMember, 'id' | 'status'>): Promise<StaffMember> => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .insert([
          {
            ...newStaffData,
            schedule: JSON.stringify(newStaffData.schedule),
            certifications: JSON.stringify(newStaffData.certifications)
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        const addedStaff: StaffMember = {
          ...data,
          schedule: staffMappers.parseSchedule(data.schedule),
          certifications: staffMappers.parseCertifications(data.certifications)
        };
        setStaff(prevStaff => [...prevStaff, addedStaff]);
        toast({
          title: "Staff member added",
          description: `${addedStaff.name} has been added successfully.`,
        });
        return addedStaff;
      } else {
        throw new Error("Failed to add staff member");
      }
    } catch (error: any) {
      toast({
        title: "Error adding staff member",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateStaffStatus = async (staffId: number, newStatus: StaffStatus): Promise<void> => {
    try {
      const { error } = await supabase
        .from('staff')
        .update({ status: newStatus })
        .eq('id', staffId);

      if (error) {
        throw new Error(error.message);
      }

      setStaff(prevStaff =>
        prevStaff.map(member =>
          member.id === staffId ? { ...member, status: newStatus } : member
        )
      );
      toast({
        title: "Staff status updated",
        description: `Staff member status updated to ${newStatus}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating staff status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateStaffInfo = async (staffId: number, updates: Partial<StaffMember>): Promise<void> => {
    try {
      const updatesWithJson = {
        ...updates,
        schedule: updates.schedule ? JSON.stringify(updates.schedule) : undefined,
        certifications: updates.certifications ? JSON.stringify(updates.certifications) : undefined
      };

      // Remove undefined values from updatesWithJson
      Object.keys(updatesWithJson).forEach(key => updatesWithJson[key] === undefined && delete updatesWithJson[key]);

      const { error } = await supabase
        .from('staff')
        .update(updatesWithJson)
        .eq('id', staffId);

      if (error) {
        throw new Error(error.message);
      }

      setStaff(prevStaff => {
        return prevStaff.map(member => {
          if (member.id === staffId) {
            const updatedMember: StaffMember = {
              ...member,
              ...updates,
              schedule: updates.schedule ? staffMappers.parseSchedule(updates.schedule) : member.schedule,
              certifications: updates.certifications ? staffMappers.parseCertifications(updates.certifications) : member.certifications
            };
            return updatedMember;
          }
          return member;
        });
      });

      toast({
        title: "Staff information updated",
        description: `Staff member information updated successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating staff information",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    staff,
    fetchStaff,
    addStaff,
    updateStaffStatus,
    updateStaffInfo,
  };
};
