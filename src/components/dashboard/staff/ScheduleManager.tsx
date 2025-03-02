
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";
import { AddShiftForm } from "./schedule/AddShiftForm";
import { WeeklySchedule } from "./schedule/WeeklySchedule";
import { PersonalInfoForm } from "./schedule/PersonalInfoForm";
import { UserPlus, Info } from "lucide-react";
import { StaffMetricsCard } from "./schedule/StaffMetricsCard";
import { CertificationsCard } from "./schedule/CertificationsCard";
import { DocumentsCard } from "./schedule/DocumentsCard";
import { EmptyScheduleCard } from "./schedule/EmptyScheduleCard";

interface ScheduleManagerProps {
  staff: StaffMember[];
  onAddShift: (staffId: number, date: string, time: string) => void;
  calculateWeeklyHours: (staffId: number) => number;
  selectedStaffId: number | null;
  onUpdateStaffInfo?: (staffId: number, updates: Partial<StaffMember>) => void;
}

export const ScheduleManager = ({
  staff,
  onAddShift,
  selectedStaffId,
  calculateWeeklyHours,
  onUpdateStaffInfo
}: ScheduleManagerProps) => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedStaffId) {
      const staffMember = staff.find(s => s.id === selectedStaffId);
      setSelectedStaff(staffMember || null);
    } else {
      setSelectedStaff(null);
    }
  }, [selectedStaffId, staff]);

  const handleUpdatePersonalInfo = (updates: Partial<StaffMember>) => {
    if (selectedStaffId && onUpdateStaffInfo) {
      onUpdateStaffInfo(selectedStaffId, updates);
    }
  };

  const handleAddShift = (date: string, time: string) => {
    if (selectedStaffId) {
      onAddShift(selectedStaffId, date, time);
    } else {
      toast({
        title: "Error",
        description: "Please select a staff member first",
        variant: "destructive"
      });
    }
  };

  const handleAddCertification = () => {
    if (!selectedStaffId) return;
    
    const newCert = prompt("Enter certification name:");
    if (newCert && onUpdateStaffInfo) {
      const currentStaff = staff.find(s => s.id === selectedStaffId);
      if (currentStaff) {
        const updatedCerts = [...(currentStaff.certifications || []), newCert];
        onUpdateStaffInfo(selectedStaffId, { certifications: updatedCerts });
        toast({
          title: "Certification Added",
          description: `Added ${newCert} to ${currentStaff.name}'s certifications`
        });
      }
    }
  };

  const handleUpdatePerformance = () => {
    if (!selectedStaffId) return;
    
    const newRating = prompt("Enter new performance rating (1-5):");
    const parsedRating = parseFloat(newRating || "");
    
    if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5 && onUpdateStaffInfo) {
      onUpdateStaffInfo(selectedStaffId, { performanceRating: parsedRating });
      toast({
        title: "Performance Updated",
        description: `Updated performance rating to ${parsedRating}/5`
      });
    } else if (!isNaN(parsedRating)) {
      toast({
        title: "Invalid Rating",
        description: "Rating must be between 1 and 5",
        variant: "destructive"
      });
    }
  };

  const handleAddMetric = (staffId: number, metricType: string, value: string) => {
    if (!value.trim()) return;
    
    const updates: Partial<StaffMember> = {};
    
    switch (metricType) {
      case "certification":
        const staffMember = staff.find(s => s.id === staffId);
        if (staffMember) {
          updates.certifications = [...(staffMember.certifications || []), value];
        }
        break;
      case "performance":
        const rating = parseFloat(value);
        if (!isNaN(rating) && rating >= 1 && rating <= 5) {
          updates.performanceRating = rating;
        }
        break;
    }
    
    if (selectedStaffId && onUpdateStaffInfo) {
      onUpdateStaffInfo(selectedStaffId, updates);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Staff Management</h2>
        <Button variant="outline" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Staff Member
        </Button>
      </div>

      {selectedStaff ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 gap-4">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="payment">Payment Details</TabsTrigger>
            <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AddShiftForm onAddShift={handleAddShift} />
              <WeeklySchedule staff={selectedStaff} />
            </div>
          </TabsContent>

          <TabsContent value="personal">
            <PersonalInfoForm 
              staff={selectedStaff}
              onUpdateInfo={handleUpdatePersonalInfo}
            />
          </TabsContent>

          <TabsContent value="payment">
            <StaffMetricsCard 
              selectedStaff={selectedStaff} 
              calculateWeeklyHours={calculateWeeklyHours}
            />
          </TabsContent>

          <TabsContent value="qualifications">
            <CertificationsCard 
              selectedStaff={selectedStaff}
              onAddCertification={handleAddCertification}
              onUpdatePerformance={handleUpdatePerformance}
            />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsCard selectedStaff={selectedStaff} />
          </TabsContent>
        </Tabs>
      ) : (
        <EmptyScheduleCard />
      )}
    </div>
  );
};
