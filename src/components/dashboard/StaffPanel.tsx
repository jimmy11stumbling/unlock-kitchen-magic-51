
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Clock, FileText, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StaffMember } from "@/types/staff";
import { AddStaffDialog } from "./staff/AddStaffDialog";
import { StaffList } from "./staff/StaffList";
import { ScheduleManager } from "./staff/ScheduleManager";
import { useStaffBasic } from "@/hooks/dashboard/staff/useStaffBasic";
import { useShiftManagement } from "@/hooks/dashboard/staff/useShiftManagement";
import { usePerformanceManagement } from "@/hooks/dashboard/staff/usePerformanceManagement";
import { useToast } from "@/components/ui/use-toast";

export const StaffPanel = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const { 
    staff, 
    loading, 
    addStaffMember, 
    updateStaffStatus, 
    updateStaffInfo 
  } = useStaffBasic();
  
  const { shifts, addShift } = useShiftManagement();
  
  const { 
    updateStaffPerformance, 
    updateStaffSchedule, 
    updateCertifications 
  } = usePerformanceManagement();

  // Filter staff based on search query
  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate attendance rate for a staff member
  const calculateAttendance = (staffId: number): number => {
    const member = staff.find(m => m.id === staffId);
    if (!member) return 0;

    const scheduledDays = Object.values(member.schedule).filter(day => day !== "OFF").length;
    const totalPossibleDays = 7;
    
    return Math.round((scheduledDays / totalPossibleDays) * 100);
  };

  // Calculate weekly hours for a staff member
  const calculateWeeklyHours = (staffId: number): number => {
    const member = staff.find(m => m.id === staffId);
    if (!member?.schedule) return 0;

    return Object.values(member.schedule)
      .filter(time => time !== "OFF")
      .reduce((total, time) => {
        const [start, end] = (time as string).split("-");
        const startHour = parseInt(start.split(":")[0]);
        const endHour = parseInt(end.split(":")[0]);
        return total + (endHour > startHour ? endHour - startHour : 24 - startHour + endHour);
      }, 0);
  };

  // Handle adding a new shift for a staff member
  const handleAddShift = (staffId: number, date: string, timeStr: string) => {
    const [startTime, endTime] = timeStr.split('-');
    addShift(staffId, date, startTime, endTime);
    
    // Update staff member's schedule based on the day of the week
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    if (selectedStaffId) {
      const updatedSchedule = { 
        ...staff.find(s => s.id === staffId)?.schedule 
      };
      
      updatedSchedule[dayOfWeek as keyof typeof updatedSchedule] = timeStr;
      
      updateStaffSchedule(staffId, updatedSchedule);
      updateStaffInfo(staffId, { schedule: updatedSchedule });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleViewDocuments = (staffId: number) => {
    setSelectedStaffId(staffId);
    setActiveTab("documents");
  };

  const handleViewPerformance = (staffId: number) => {
    setSelectedStaffId(staffId);
    setActiveTab("performance");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage your team members and schedules</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              className="pl-8 w-full sm:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <AddStaffDialog onAddStaff={addStaffMember} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Staff List
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="p-6">
            {loading ? (
              <div className="text-center py-8">Loading staff data...</div>
            ) : (
              <StaffList
                staff={filteredStaff}
                onUpdateStatus={updateStaffStatus}
                onSelectStaff={setSelectedStaffId}
                calculateAttendance={calculateAttendance}
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="p-6">
            {loading ? (
              <div className="text-center py-8">Loading schedule data...</div>
            ) : (
              <ScheduleManager
                staff={staff}
                onAddShift={handleAddShift}
                calculateWeeklyHours={calculateWeeklyHours}
                selectedStaffId={selectedStaffId}
                onUpdateStaffInfo={updateStaffInfo}
              />
            )}
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Performance Reviews</h2>
                <Button 
                  variant="outline"
                  onClick={() => toast({ 
                    title: "Coming Soon", 
                    description: "Performance review creation is under development" 
                  })}
                >
                  Add Review
                </Button>
              </div>
              
              {selectedStaffId ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Attendance Rate</h3>
                      <p className="text-2xl font-bold">{calculateAttendance(selectedStaffId)}%</p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Weekly Hours</h3>
                      <p className="text-2xl font-bold">{calculateWeeklyHours(selectedStaffId)}h</p>
                    </Card>
                    <Card className="p-4">
                      <h3 className="font-medium mb-2">Performance Score</h3>
                      <p className="text-2xl font-bold">
                        {staff.find(m => m.id === selectedStaffId)?.performance_rating || 0}/10
                      </p>
                    </Card>
                  </div>
                  
                  <Card className="p-4">
                    <h3 className="font-medium mb-4">Performance History</h3>
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No performance reviews have been submitted yet.</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => toast({ 
                          title: "Coming Soon", 
                          description: "Performance review creation is under development" 
                        })}
                      >
                        Create First Review
                      </Button>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Select a staff member to view their performance metrics
                  </p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Staff Documents</h2>
                <Button 
                  variant="outline"
                  onClick={() => toast({ 
                    title: "Coming Soon", 
                    description: "Document upload functionality is under development" 
                  })}
                >
                  Upload Document
                </Button>
              </div>
              
              {selectedStaffId ? (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">
                      {staff.find(m => m.id === selectedStaffId)?.name}'s Documents
                    </h3>
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between items-center p-2 bg-background rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          <span>Employment Contract</span>
                        </div>
                        <Button size="sm" variant="ghost">View</Button>
                      </div>
                      
                      <div className="flex justify-between items-center p-2 bg-background rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          <span>Tax Forms</span>
                        </div>
                        <Button size="sm" variant="ghost">View</Button>
                      </div>
                      
                      {staff.find(m => m.id === selectedStaffId)?.certifications?.map((cert, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-background rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            <span>{cert} Certificate</span>
                          </div>
                          <Button size="sm" variant="ghost">View</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Select a staff member to view their documents
                  </p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
