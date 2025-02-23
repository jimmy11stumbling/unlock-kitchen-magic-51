import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import type { StaffMember, Shift } from "@/types/staff";
import {
  User,
  Clock,
  Calendar as CalendarIcon,
  DollarSign,
  UserPlus,
  ClipboardList,
  BookOpen
} from "lucide-react";

interface StaffPanelProps {
  staff: StaffMember[];
  onAddStaff: (data: Omit<StaffMember, "id" | "status">) => void;
  onUpdateStatus: (staffId: number, status: StaffMember["status"]) => void;
  onAddShift: (staffId: number, date: string, time: string) => void;
  onUpdateInfo: (staffId: number, updates: Partial<StaffMember>) => void;
}

export const StaffPanel = ({
  staff,
  onAddStaff,
  onUpdateStatus,
  onAddShift,
  onUpdateInfo,
}: StaffPanelProps) => {
  const [newStaff, setNewStaff] = useState({ name: "", role: "", salary: "" });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedShiftTime, setSelectedShiftTime] = useState("Morning");
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("list");

  const handleAddStaff = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const completeStaffData: Omit<StaffMember, "id" | "status"> = {
      name: newStaff.name,
      role: newStaff.role,
      salary: newStaff.salary,
      shift: "Morning",
      email: "",
      phone: "",
      address: "",
      emergencyContact: {
        name: "",
        phone: "",
        relationship: ""
      },
      startDate: currentDate,
      department: newStaff.role,
      certifications: [],
      performanceRating: 0,
      notes: "",
      schedule: {
        monday: "OFF",
        tuesday: "OFF",
        wednesday: "OFF",
        thursday: "OFF",
        friday: "OFF",
        saturday: "OFF",
        sunday: "OFF"
      },
      bankInfo: {
        accountNumber: "",
        routingNumber: "",
        accountType: "checking"
      }
    };

    onAddStaff(completeStaffData);
    setNewStaff({ name: "", role: "", salary: "" });
  };

  const handleAddShift = () => {
    if (selectedStaffId && selectedDate) {
      onAddShift(
        selectedStaffId,
        selectedDate.toISOString().split('T')[0],
        selectedShiftTime
      );
    }
  };

  const getStatusColor = (status: StaffMember["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "on_break":
        return "bg-yellow-500";
      case "off_duty":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const calculateAttendance = (staffId: number) => {
    // Simulated attendance calculation
    return Math.floor(Math.random() * 30) + 70; // 70-100%
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 gap-4 mb-4">
          <TabsTrigger value="list">
            <User className="h-4 w-4 mr-2" />
            Staff List
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Clock className="h-4 w-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="performance">
            <ClipboardList className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="training">
            <BookOpen className="h-4 w-4 mr-2" />
            Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Staff Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Staff Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={newStaff.name}
                        onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                        placeholder="Staff member name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <Select
                        value={newStaff.role}
                        onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chef">Chef</SelectItem>
                          <SelectItem value="server">Server</SelectItem>
                          <SelectItem value="host">Host</SelectItem>
                          <SelectItem value="bartender">Bartender</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Salary</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          value={newStaff.salary}
                          onChange={(e) => setNewStaff({ ...newStaff, salary: e.target.value })}
                          placeholder="Annual salary"
                          className="pl-10"
                          type="number"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleAddStaff}
                      className="w-full"
                    >
                      Add Staff Member
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={member.status}
                        onValueChange={(value: StaffMember["status"]) =>
                          onUpdateStatus(member.id, value)
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on_break">On Break</SelectItem>
                          <SelectItem value="off_duty">Off Duty</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={calculateAttendance(member.id)} className="w-[60px]" />
                        <span className="text-sm">{calculateAttendance(member.id)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStaffId(member.id)}
                        >
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Schedule Management</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Select
                  value={selectedStaffId?.toString() || ""}
                  onValueChange={(value) => setSelectedStaffId(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staff.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="mt-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Select
                  value={selectedShiftTime}
                  onValueChange={setSelectedShiftTime}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning Shift (6AM - 2PM)</SelectItem>
                    <SelectItem value="Afternoon">Afternoon Shift (2PM - 10PM)</SelectItem>
                    <SelectItem value="Evening">Evening Shift (10PM - 6AM)</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  className="w-full"
                  onClick={handleAddShift}
                  disabled={!selectedStaffId || !selectedDate}
                >
                  Add Shift
                </Button>

                <Card className="p-4 mt-4">
                  <h4 className="font-medium mb-2">Scheduled Shifts</h4>
                  {/* Add scheduled shifts list here */}
                </Card>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            {/* Add performance metrics here */}
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Training Programs</h3>
            {/* Add training programs here */}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
