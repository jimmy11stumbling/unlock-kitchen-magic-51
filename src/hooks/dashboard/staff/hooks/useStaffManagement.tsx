
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { staffMappers } from "../utils/staffMapper";
import { readQueries } from "../services/queries/readQueries";
import type { StaffMember, StaffStatus } from "@/types/staff";

export const useStaffManagement = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      const staffData = await readQueries.getAllStaffMembers();
      setStaff(staffData);
      return staffData;
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError("Failed to fetch staff");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addStaffMember = async (data: Omit<StaffMember, "id">) => {
    try {
      setLoading(true);
      const dbStaff = staffMappers.mapStaffMemberToDatabase(data);
      
      const { data: newStaff, error: insertError } = await supabase
        .from("staff_members")
        .insert(dbStaff)
        .select()
        .single();

      if (insertError) throw insertError;

      if (newStaff) {
        const mappedStaff = staffMappers.mapDatabaseToStaffMember(newStaff);
        setStaff(prev => [...prev, mappedStaff]);
        return mappedStaff;
      }

      throw new Error("Failed to add staff member");
    } catch (err) {
      console.error("Error adding staff member:", err);
      setError("Failed to add staff member");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStaffStatus = async (staffId: number, newStatus: StaffStatus) => {
    try {
      setLoading(true);
      const dbStatus = staffMappers.mapStaffMemberToDatabase({ status: newStatus }).status;

      const { data, error: updateError } = await supabase
        .from("staff_members")
        .update({ status: dbStatus })
        .eq("id", staffId)
        .select()
        .single();

      if (updateError) throw updateError;

      if (data) {
        const mappedStaff = staffMappers.mapDatabaseToStaffMember(data);
        setStaff(prev => 
          prev.map(member => 
            member.id === mappedStaff.id ? mappedStaff : member
          )
        );
        return mappedStaff;
      }

      throw new Error("Failed to update staff status");
    } catch (err) {
      console.error("Error updating staff status:", err);
      setError("Failed to update staff status");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStaffMember = async (updatedMember: Partial<StaffMember> & { id: number }) => {
    try {
      const dbData = staffMappers.mapStaffMemberToDatabase(updatedMember);
      
      const { data, error: updateError } = await supabase
        .from("staff_members")
        .update(dbData)
        .eq("id", updatedMember.id)
        .select()
        .single();

      if (updateError) throw updateError;

      if (data) {
        const mappedStaff = staffMappers.mapDatabaseToStaffMember(data);
        setStaff(prev => 
          prev.map(member => 
            member.id === mappedStaff.id ? mappedStaff : member
          )
        );
        return mappedStaff;
      }

      throw new Error("Failed to update staff member");
    } catch (err) {
      console.error("Error updating staff member:", err);
      setError("Failed to update staff member");
      throw err;
    }
  };

  const calculateWeeklyHours = (staffId: number) => {
    const member = staff.find(s => s.id === staffId);
    if (!member?.schedule) return 0;

    return Object.values(member.schedule)
      .filter(time => time !== "OFF")
      .reduce((total, time) => {
        if (typeof time !== 'string' || !time.includes("-")) return total;
        
        const [start, end] = time.split("-");
        if (!start || !end) return total;
        
        const startHour = parseInt(start.split(":")[0]);
        const endHour = parseInt(end.split(":")[0]);
        
        return total + (endHour > startHour ? endHour - startHour : 24 - startHour + endHour);
      }, 0);
  };

  const deleteStaffMember = async (id: number) => {
    try {
      const { error } = await supabase
        .from("staff_members")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setStaff(prev => prev.filter(member => member.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting staff member:", err);
      setError("Failed to delete staff member");
      throw err;
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  return {
    staff,
    loading,
    error,
    fetchStaffMembers,
    addStaffMember,
    updateStaffMember,
    updateStaffStatus,
    deleteStaffMember,
    calculateWeeklyHours,
  };
};
