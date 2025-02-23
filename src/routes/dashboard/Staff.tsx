
import { StaffPanel } from "@/components/dashboard/StaffPanel";
import { useDashboardState } from "@/hooks/useDashboardState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  User, Clock, FileText, BookOpen, Star,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Staff = () => {
  const { 
    staff, 
    addStaffMember, 
    updateStaffStatus, 
    addShift,
    updateStaffInfo
  } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col items-start gap-4 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="font-playfair text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent animate-fade-in">
            MaestroAI
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-[200px] p-2 bg-popover border border-border shadow-lg"
            >
              <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                Staff Management System
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                Performance Tracking
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                Schedule Optimization
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                Attendance Monitoring
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-muted-foreground text-sm">
          Comprehensive staff management and scheduling system
        </p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-4 mb-4">
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
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Performance Reviews</h2>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Training Programs</h2>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Staff;
