
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Calendar as CalendarIcon,
  CreditCard,
  DollarSign,
  FileText,
  GraduationCap,
  UserPlus,
  Award,
  Info
} from "lucide-react";
import type { StaffMember } from "@/types/staff";
import { format } from "date-fns";

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
  calculateWeeklyHours,
  selectedStaffId,
  onUpdateStaffInfo
}: ScheduleManagerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [shiftTime, setShiftTime] = useState("09:00-17:00");
  const [activeTab, setActiveTab] = useState("schedule");

  const selectedStaff = staff.find(s => s.id === selectedStaffId);

  const handleUpdatePersonalInfo = (updates: Partial<StaffMember>) => {
    if (selectedStaffId && onUpdateStaffInfo) {
      onUpdateStaffInfo(selectedStaffId, updates);
    }
  };

  const handleAddShift = () => {
    if (selectedStaffId) {
      onAddShift(
        selectedStaffId,
        format(selectedDate, "yyyy-MM-dd"),
        shiftTime
      );
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
            <TabsTrigger value="schedule" className="gap-2">
              <Clock className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="personal" className="gap-2">
              <Info className="h-4 w-4" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Payment Details
            </TabsTrigger>
            <TabsTrigger value="qualifications" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Qualifications
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Add New Shift</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Select Date</label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Shift Time</label>
                    <Select value={shiftTime} onValueChange={setShiftTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shift time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00-17:00">9:00 AM - 5:00 PM</SelectItem>
                        <SelectItem value="10:00-18:00">10:00 AM - 6:00 PM</SelectItem>
                        <SelectItem value="14:00-22:00">2:00 PM - 10:00 PM</SelectItem>
                        <SelectItem value="18:00-02:00">6:00 PM - 2:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddShift} className="w-full">
                    Add Shift
                  </Button>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Weekly Schedule</h3>
                <div className="space-y-2">
                  {Object.entries(selectedStaff.schedule).map(([day, time]) => (
                    <div key={day} className="flex justify-between items-center py-2 border-b">
                      <span className="capitalize">{day}</span>
                      <span className="font-medium">{time === "OFF" ? "Off" : time}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="personal" className="space-y-4">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={selectedStaff.name}
                      onChange={(e) => handleUpdatePersonalInfo({ name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={selectedStaff.email}
                      onChange={(e) => handleUpdatePersonalInfo({ email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={selectedStaff.phone}
                      onChange={(e) => handleUpdatePersonalInfo({ phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <Textarea
                      value={selectedStaff.address}
                      onChange={(e) => handleUpdatePersonalInfo({ address: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Emergency Contact</label>
                    <Input
                      placeholder="Name"
                      value={selectedStaff.emergencyContact.name}
                      onChange={(e) => handleUpdatePersonalInfo({
                        emergencyContact: {
                          ...selectedStaff.emergencyContact,
                          name: e.target.value
                        }
                      })}
                    />
                    <Input
                      className="mt-2"
                      placeholder="Phone"
                      value={selectedStaff.emergencyContact.phone}
                      onChange={(e) => handleUpdatePersonalInfo({
                        emergencyContact: {
                          ...selectedStaff.emergencyContact,
                          phone: e.target.value
                        }
                      })}
                    />
                    <Input
                      className="mt-2"
                      placeholder="Relationship"
                      value={selectedStaff.emergencyContact.relationship}
                      onChange={(e) => handleUpdatePersonalInfo({
                        emergencyContact: {
                          ...selectedStaff.emergencyContact,
                          relationship: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Direct Deposit Information</h3>
                  <div>
                    <label className="text-sm font-medium">Account Number</label>
                    <Input
                      type="password"
                      value={selectedStaff.bankInfo.accountNumber}
                      onChange={(e) => handleUpdatePersonalInfo({
                        bankInfo: {
                          ...selectedStaff.bankInfo,
                          accountNumber: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Routing Number</label>
                    <Input
                      type="password"
                      value={selectedStaff.bankInfo.routingNumber}
                      onChange={(e) => handleUpdatePersonalInfo({
                        bankInfo: {
                          ...selectedStaff.bankInfo,
                          routingNumber: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account Type</label>
                    <Select
                      value={selectedStaff.bankInfo.accountType}
                      onValueChange={(value: "checking" | "savings") => handleUpdatePersonalInfo({
                        bankInfo: {
                          ...selectedStaff.bankInfo,
                          accountType: value
                        }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Compensation</h3>
                  <div>
                    <label className="text-sm font-medium">Salary</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        type="number"
                        className="pl-10"
                        value={selectedStaff.salary}
                        onChange={(e) => handleUpdatePersonalInfo({
                          salary: Number(e.target.value)
                        })}
                      />
                    </div>
                  </div>
                  {selectedStaff.hourlyRate !== undefined && (
                    <div>
                      <label className="text-sm font-medium">Hourly Rate</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          type="number"
                          className="pl-10"
                          value={selectedStaff.hourlyRate}
                          onChange={(e) => handleUpdatePersonalInfo({
                            hourlyRate: Number(e.target.value)
                          })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="qualifications" className="space-y-4">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Certifications</h3>
                  <div className="space-y-2">
                    {selectedStaff.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Performance</h3>
                  <div>
                    <label className="text-sm font-medium">Rating</label>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={selectedStaff.performanceRating}
                      onChange={(e) => handleUpdatePersonalInfo({
                        performanceRating: Number(e.target.value)
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      value={selectedStaff.notes}
                      onChange={(e) => handleUpdatePersonalInfo({
                        notes: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Employee Documents</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Recent Documents</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            Select a staff member to view and manage their information
          </p>
        </Card>
      )}
    </div>
  );
};
