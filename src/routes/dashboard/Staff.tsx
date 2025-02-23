
import { StaffPanel } from "@/components/dashboard/StaffPanel";
import { useDashboardState } from "@/hooks/useDashboardState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  User, Clock, FileText, BookOpen, Star,
  ChevronDown, BarChart, Award, Target,
  Calendar, BookMarked, GraduationCap
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
              className="w-[280px] p-2 bg-popover border border-border shadow-lg rounded-lg"
            >
              <DropdownMenuItem className="cursor-pointer hover:bg-muted flex items-center gap-2 p-3">
                <User className="h-4 w-4" />
                Staff Management System
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-muted flex items-center gap-2 p-3">
                <BarChart className="h-4 w-4" />
                Performance Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-muted flex items-center gap-2 p-3">
                <Calendar className="h-4 w-4" />
                Schedule Optimization
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-muted flex items-center gap-2 p-3">
                <Target className="h-4 w-4" />
                Goal Tracking
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-muted-foreground text-sm">
          Advanced AI-powered staff management and optimization platform
        </p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-4 gap-4 mb-4">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Staff List
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Schedules
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
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
              <div>
                <h2 className="text-lg font-semibold">Staff Schedules</h2>
                <p className="text-sm text-muted-foreground">Manage and optimize staff scheduling</p>
              </div>
            </div>
            {/* Schedule content will be implemented in the next iteration */}
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Performance Analytics</h2>
                <p className="text-sm text-muted-foreground">Track and analyze staff performance metrics</p>
              </div>
            </div>
            {/* Performance metrics will be implemented in the next iteration */}
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Training Programs</h2>
                <p className="text-sm text-muted-foreground">Manage staff development and certifications</p>
              </div>
            </div>
            {/* Training modules will be implemented in the next iteration */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Staff;
