
import { StaffPanel } from "@/components/dashboard/StaffPanel";
import { useDashboardState } from "@/hooks/useDashboardState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, Clock, FileText, Award, Calendar,
  DollarSign, Phone, Mail, MapPin, AlertCircle,
  Briefcase, Star, Building, BookOpen
} from "lucide-react";

const Staff = () => {
  const { 
    staff, 
    addStaffMember, 
    updateStaffStatus, 
    addShift,
    updateStaffInfo,
    updateStaffSchedule,
    updateStaffPerformance
  } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Staff Management</h1>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid grid-cols-5 gap-4 mb-4">
          <TabsTrigger value="list">
            <User className="h-4 w-4 mr-2" />
            Staff List
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Clock className="h-4 w-4 mr-2" />
            Schedules
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Star className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="training">
            <BookOpen className="h-4 w-4 mr-2" />
            Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <StaffPanel
            staff={staff}
            onAddStaff={addStaffMember}
            onUpdateStatus={updateStaffStatus}
            onAddShift={addShift}
            onUpdateInfo={updateStaffInfo}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Staff Schedules</h2>
            </div>
            {/* Schedule content will be implemented in StaffSchedulePanel */}
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Performance Reviews</h2>
            </div>
            {/* Performance content will be implemented in StaffPerformancePanel */}
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Staff Documents</h2>
            </div>
            {/* Documents content will be implemented in StaffDocumentsPanel */}
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Training Programs</h2>
            </div>
            {/* Training content will be implemented in StaffTrainingPanel */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Staff;
