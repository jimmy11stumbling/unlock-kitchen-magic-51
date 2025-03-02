
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { staffMappers } from "../utils/staffMapper";
import { readQueries } from "../services/queries/readQueries";
import { writeQueries } from "../services/queries/writeQueries";
import type { StaffMember, StaffStatus } from "@/types/staff";
import type { Json } from "@/integrations/supabase/types";

export const useStaffManagement = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("staff_members")
        .select("*");

      if (error) throw error;

      if (data) {
        const mappedStaff = data.map(staffMappers.mapDatabaseToStaffMember);
        setStaff(mappedStaff);
        return mappedStaff;
      }
      return [];
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError("Failed to fetch staff");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const seedInitialStaffData = async () => {
    try {
      // Insert each staff member individually to avoid array issues
      const initialData = [
        {
          name: "John Manager",
          email: "john@restaurant.com",
          phone: "555-123-4567",
          role: "manager" as const,
          department: "Management",
          status: "active" as "active" | "on_break" | "off_duty" // Convert to compatible type
        },
        {
          name: "Maria Chef",
          email: "maria@restaurant.com",
          phone: "555-234-5678",
          role: "chef" as const,
          department: "Kitchen",
          status: "active" as "active" | "on_break" | "off_duty"
        }
      ];
      
      for (const staff of initialData) {
        await supabase.from("staff_members").insert(staff);
      }

      await fetchStaffMembers();
    } catch (err) {
      console.error("Error seeding staff data:", err);
      setError("Failed to seed initial staff data");
    }
  };

  const addStaffMember = async (data: Omit<StaffMember, "id">) => {
    try {
      const formattedData = staffMappers.mapStaffMemberToDatabase(data);
      // Ensure status is one of the valid values for the database
      const safeStatus = formattedData.status as string;
      const safeData = {
        ...formattedData,
        status: (["active", "on_break", "off_duty"].includes(safeStatus) 
          ? safeStatus 
          : "active") as "active" | "on_break" | "off_duty"
      };

      const { data: newStaff, error } = await supabase
        .from("staff_members")
        .insert(safeData)
        .select()
        .single();

      if (error) throw error;

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
    }
  };

  const updateStaffMember = async (updatedMember: Partial<StaffMember>) => {
    try {
      if (!updatedMember.id) throw new Error("Staff member ID is required for updates");

      // Convert StaffMember to database format and ensure status is compatible
      let dbData = staffMappers.mapStaffMemberToDatabase(updatedMember as StaffMember);
      
      // Safety check for status field
      if (dbData.status && typeof dbData.status === 'string') {
        dbData.status = (["active", "on_break", "off_duty"].includes(dbData.status) 
          ? dbData.status 
          : "active") as "active" | "on_break" | "off_duty";
      }

      const { data, error } = await supabase
        .from("staff_members")
        .update(dbData)
        .eq("id", updatedMember.id)
        .select()
        .single();

      if (error) throw error;

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
    deleteStaffMember,
    calculateWeeklyHours,
  };
};
