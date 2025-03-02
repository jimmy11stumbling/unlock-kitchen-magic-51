
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { GraduationCap, UserPlus } from "lucide-react";
import type { StaffMember } from "@/types/staff";
import { StaffMetricsCard } from "./schedule/StaffMetricsCard";
import { DocumentsCard } from "./schedule/DocumentsCard";
import { EmptyScheduleCard } from "./schedule/EmptyScheduleCard";

interface ScheduleManagerProps {
  staff: StaffMember[];
  onAddShift: (staffId: number, date: string, time: string) => void;
  calculateWeeklyHours: (staffId: number) => number;
  selectedStaffId: number | null;
  onUpdateStaffInfo: (staffId: number, updates: Partial<StaffMember>) => Promise<void>;
}

export const ScheduleManager = ({
  staff,
  onAddShift,
  calculateWeeklyHours,
  selectedStaffId,
  onUpdateStaffInfo
}: ScheduleManagerProps) => {
  const [activeTab, setActiveTab] = useState("schedule");
  const [shiftDate, setShiftDate] = useState("");
  const [shiftTime, setShiftTime] = useState("");
  const [certificationInput, setCertificationInput] = useState("");
  const { toast } = useToast();

  // Get the selected staff member
  const selectedStaff = staff.find(s => s.id === selectedStaffId);

  const handleAddCertification = async () => {
    if (!selectedStaff || !certificationInput.trim()) return;
    
    const updatedCertifications = [
      ...(selectedStaff.certifications || []),
      certificationInput.trim()
    ];
    
    try {
      await onUpdateStaffInfo(selectedStaff.id, {
        certifications: updatedCertifications
      });
      
      toast({
        title: "Certification Added",
        description: `Added ${certificationInput} to ${selectedStaff.name}'s certifications.`
      });
      
      setCertificationInput("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add certification",
        variant: "destructive"
      });
    }
  };

  const handleAddShift = () => {
    if (!selectedStaffId || !shiftDate || !shiftTime) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for the shift.",
        variant: "destructive"
      });
      return;
    }

    onAddShift(selectedStaffId, shiftDate, shiftTime);
    
    toast({
      title: "Shift Added",
      description: `Added shift on ${shiftDate} for ${selectedStaff?.name}`
    });
    
    setShiftDate("");
    setShiftTime("");
  };

  // Render empty state if no staff member is selected
  if (!selectedStaff) {
    return <EmptyScheduleCard />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{selectedStaff.name}</h2>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${
            selectedStaff.performanceRating > 7 
              ? 'bg-green-100 text-green-800' 
              : selectedStaff.performanceRating > 4 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
          }`}>
            Performance: {selectedStaff.performanceRating}/10
          </span>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Add Shift</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={shiftDate}
                  onChange={(e) => setShiftDate(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Shift Time</Label>
                <Select value={shiftTime} onValueChange={setShiftTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00-17:00">9:00 AM - 5:00 PM</SelectItem>
                    <SelectItem value="08:00-16:00">8:00 AM - 4:00 PM</SelectItem>
                    <SelectItem value="16:00-00:00">4:00 PM - 12:00 AM</SelectItem>
                    <SelectItem value="00:00-08:00">12:00 AM - 8:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={handleAddShift} className="w-full">Add Shift</Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Current Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedStaff.schedule || {}).map(([day, time]) => (
                <div key={day} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <span className="font-medium capitalize">{day}</span>
                  </div>
                  <div>
                    <span className={time === "OFF" ? "text-gray-400" : "text-green-600 font-medium"}>
                      {time === "OFF" ? "Day Off" : time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <StaffMetricsCard 
            selectedStaff={selectedStaff} 
            calculateWeeklyHours={calculateWeeklyHours} 
          />
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Add Certification</h3>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input 
                  placeholder="Enter certification name" 
                  value={certificationInput}
                  onChange={(e) => setCertificationInput(e.target.value)}
                />
              </div>
              <Button onClick={handleAddCertification}>
                <GraduationCap className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Current Certifications</h3>
            {selectedStaff.certifications && selectedStaff.certifications.length > 0 ? (
              <div className="space-y-2">
                {selectedStaff.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-md">
                    <GraduationCap className="h-5 w-5 mr-2 text-blue-500" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No certifications on file</p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <DocumentsCard selectedStaff={selectedStaff} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
