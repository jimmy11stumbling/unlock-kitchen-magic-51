import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";
import { AddShiftForm } from "./schedule/AddShiftForm";
import { WeeklySchedule } from "./schedule/WeeklySchedule";
import { PersonalInfoForm } from "./schedule/PersonalInfoForm";
import { UserPlus, Info, DollarSign, GraduationCap, FileText } from "lucide-react";

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

  const RatingRow = ({ staffMember }: { staffMember: StaffMember }) => {
    return (
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1/3 text-sm font-medium">{staffMember.name}</div>
        <div className="w-1/3">
          <span className="text-sm">
            Rating: {staffMember.performanceRating}/5
          </span>
        </div>
        <div className="w-1/3">
          <Button variant="outline" size="sm">
            Update
          </Button>
        </div>
      </div>
    );
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
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="font-semibold mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="text-lg font-medium">${selectedStaff.salary?.toLocaleString()}/year</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Weekly Hours</p>
                    <p className="text-lg font-medium">{calculateWeeklyHours(selectedStaff.id)} hours</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="text-lg font-medium">Direct Deposit</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Last Payment</p>
                    <p className="text-lg font-medium">June 15, 2023</p>
                  </div>
                </div>
                <Button onClick={() => toast({ title: "Coming Soon", description: "This feature is under development" })}>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="qualifications">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Qualifications & Certifications</h3>
                  <Button variant="outline" onClick={handleAddCertification}>
                    Add Certification
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {selectedStaff.certifications && selectedStaff.certifications.length > 0 ? (
                    selectedStaff.certifications.map((cert, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                        <div className="flex items-center">
                          <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                          <span>{cert}</span>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No certifications added yet.</p>
                  )}
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Performance Rating</h3>
                    <Button size="sm" onClick={handleUpdatePerformance}>Update</Button>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-primary h-4 rounded-full" 
                      style={{ width: `${(selectedStaff.performanceRating / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span>0</span>
                    <span className="font-medium">{selectedStaff.performanceRating}/5</span>
                    <span>5</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold mb-4">Staff Documents</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => toast({ title: "Coming Soon", description: "Document upload feature is under development" })}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-500" />
                      <span>Employment Contract</span>
                    </div>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-green-500" />
                      <span>Tax Information</span>
                    </div>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                  
                  {selectedStaff.certifications && selectedStaff.certifications.map((cert, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-purple-500" />
                        <span>{cert} Certificate</span>
                      </div>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Info className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Staff Member Selected</h3>
            <p className="text-muted-foreground mb-4">
              Select a staff member from the list to view and manage their information
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
