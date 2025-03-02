
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { StaffMember } from "@/types/staff";

export const useStaffBasic = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Initial fetch of staff data
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        await fetchStaffMembers();
      } catch (err) {
        setError("Failed to load staff data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("staff_members")
        .select("*");

      if (error) throw error;

      if (data) {
        // Map database staff to application model if needed
        const mappedStaff = data.map((member) => ({
          id: member.id,
          name: member.name,
          email: member.email,
          phone: member.phone,
          role: member.role,
          hireDate: member.hire_date,
          schedule: member.schedule,
          hourlyRate: member.hourly_rate,
          overtimeRate: member.overtime_rate,
          status: member.status,
          department: member.department,
          performanceRating: member.performance_rating,
          address: member.address,
          certifications: member.certifications,
          emergencyContact: member.emergency_contact,
          shift: member.shift,
          notes: member.notes,
          salary: member.salary
        })) as StaffMember[];
        
        setStaff(mappedStaff);
        return mappedStaff;
      }
      return [];
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError("Failed to fetch staff data");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get a specific staff member by ID
  const getStaffMember = (id: number) => {
    return staff.find(member => member.id === id);
  };

  // Add a new staff member
  const addStaffMember = async (data: Omit<StaffMember, "id">) => {
    try {
      // Convert application staff to database format if needed
      const dbStaff = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        hire_date: data.hireDate,
        schedule: data.schedule,
        hourly_rate: data.hourlyRate,
        overtime_rate: data.overtimeRate,
        status: data.status,
        department: data.department,
        performance_rating: data.performanceRating,
        address: data.address,
        certifications: data.certifications,
        emergency_contact: data.emergencyContact,
        shift: data.shift,
        notes: data.notes,
        salary: data.salary
      };

      // Ensure status is one of the allowed database values
      if (dbStaff.status && typeof dbStaff.status === 'string') {
        dbStaff.status = (["active", "on_break", "off_duty"].includes(dbStaff.status) 
          ? dbStaff.status 
          : "active") as any;
      }

      const { data: newStaff, error } = await supabase
        .from("staff_members")
        .insert(dbStaff)
        .select()
        .single();

      if (error) throw error;

      if (newStaff) {
        // Map the returned database staff to application model
        const mappedStaff: StaffMember = {
          id: newStaff.id,
          name: newStaff.name,
          email: newStaff.email,
          phone: newStaff.phone,
          role: newStaff.role,
          hireDate: newStaff.hire_date,
          schedule: newStaff.schedule,
          hourlyRate: newStaff.hourly_rate,
          overtimeRate: newStaff.overtime_rate,
          status: newStaff.status,
          department: newStaff.department,
          performanceRating: newStaff.performance_rating,
          address: newStaff.address,
          certifications: newStaff.certifications,
          emergencyContact: newStaff.emergency_contact,
          shift: newStaff.shift,
          notes: newStaff.notes,
          salary: newStaff.salary
        };

        setStaff([...staff, mappedStaff]);
        return mappedStaff;
      }

      throw new Error("Failed to add staff member");
    } catch (err) {
      console.error("Error adding staff member:", err);
      throw err;
    }
  };

  // Update a staff member's status
  const updateStaffStatus = async (staffId: number, newStatus: string) => {
    try {
      // Ensure status is one of the allowed database values
      const safeStatus = (["active", "on_break", "off_duty"].includes(newStatus) 
        ? newStatus 
        : "active") as any;
      
      const { data, error } = await supabase
        .from("staff_members")
        .update({ status: safeStatus })
        .eq("id", staffId)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Update local state
        setStaff(
          staff.map((member) =>
            member.id === staffId
              ? { ...member, status: data.status }
              : member
          )
        );
        return data;
      }

      throw new Error("Failed to update staff status");
    } catch (err) {
      console.error("Error updating staff status:", err);
      throw err;
    }
  };

  // Update staff info
  const updateStaffInfo = async (staffId: number, updates: Partial<StaffMember>) => {
    try {
      // Convert application updates to database format
      const dbUpdates: any = {};
      
      // Map each property to its database equivalent
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.role !== undefined) dbUpdates.role = updates.role;
      if (updates.hireDate !== undefined) dbUpdates.hire_date = updates.hireDate;
      if (updates.schedule !== undefined) dbUpdates.schedule = updates.schedule;
      if (updates.hourlyRate !== undefined) dbUpdates.hourly_rate = updates.hourlyRate;
      if (updates.overtimeRate !== undefined) dbUpdates.overtime_rate = updates.overtimeRate;
      if (updates.status !== undefined) {
        // Ensure status is one of the allowed database values
        dbUpdates.status = (["active", "on_break", "off_duty"].includes(updates.status) 
          ? updates.status 
          : "active") as any;
      }
      if (updates.department !== undefined) dbUpdates.department = updates.department;
      if (updates.performanceRating !== undefined) dbUpdates.performance_rating = updates.performanceRating;
      if (updates.address !== undefined) dbUpdates.address = updates.address;
      if (updates.certifications !== undefined) dbUpdates.certifications = updates.certifications;
      if (updates.emergencyContact !== undefined) dbUpdates.emergency_contact = updates.emergencyContact;
      if (updates.shift !== undefined) dbUpdates.shift = updates.shift;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      if (updates.salary !== undefined) dbUpdates.salary = updates.salary;

      const { data, error } = await supabase
        .from("staff_members")
        .update(dbUpdates)
        .eq("id", staffId)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Map returned database staff to application model
        const updatedStaff: StaffMember = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          hireDate: data.hire_date,
          schedule: data.schedule,
          hourlyRate: data.hourly_rate,
          overtimeRate: data.overtime_rate,
          status: data.status,
          department: data.department,
          performanceRating: data.performance_rating,
          address: data.address,
          certifications: data.certifications,
          emergencyContact: data.emergency_contact,
          shift: data.shift,
          notes: data.notes,
          salary: data.salary
        };

        // Update local state
        setStaff(
          staff.map((member) =>
            member.id === staffId ? updatedStaff : member
          )
        );
        return updatedStaff;
      }

      throw new Error("Failed to update staff information");
    } catch (err) {
      console.error("Error updating staff info:", err);
      throw err;
    }
  };

  // Calculate weekly hours for a staff member
  const calculateWeeklyHours = (staffId: number): number => {
    const member = staff.find(m => m.id === staffId);
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

  return {
    staff,
    loading,
    error,
    fetchStaffMembers,
    addStaffMember,
    updateStaffStatus,
    updateStaffInfo,
    getStaffMember,
    calculateWeeklyHours,
  };
};
