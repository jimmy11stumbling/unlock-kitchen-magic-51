
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import type { StaffMember, Shift } from "@/types/staff";

interface StaffPanelProps {
  staff: StaffMember[];
  onAddStaff: (data: { name: string; role: string; salary: string }) => void;
  onUpdateStatus: (staffId: number, status: StaffMember["status"]) => void;
  onAddShift: (staffId: number, date: string, time: string) => void;
}

export const StaffPanel = ({
  staff,
  onAddStaff,
  onUpdateStatus,
  onAddShift,
}: StaffPanelProps) => {
  const [newStaff, setNewStaff] = useState({ name: "", role: "", salary: "" });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedShiftTime, setSelectedShiftTime] = useState("Morning");
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  const handleAddShift = () => {
    if (selectedStaffId && selectedDate) {
      onAddShift(
        selectedStaffId,
        selectedDate.toISOString().split('T')[0],
        selectedShiftTime
      );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Staff Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Staff Member</Button>
            </DialogTrigger>
            <DialogContent>
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
                  <Input
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    placeholder="Staff role"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Salary</label>
                  <Input
                    value={newStaff.salary}
                    onChange={(e) => setNewStaff({ ...newStaff, salary: e.target.value })}
                    placeholder="Salary"
                  />
                </div>
                <Button
                  onClick={() => {
                    onAddStaff(newStaff);
                    setNewStaff({ name: "", role: "", salary: "" });
                  }}
                >
                  Add Staff Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium mb-4">Staff List</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <Select
                        value={member.status}
                        onValueChange={(value: StaffMember["status"]) =>
                          onUpdateStatus(member.id, value)
                        }
                      >
                        <SelectTrigger>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStaffId(member.id)}
                      >
                        Schedule
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-md font-medium mb-4">Schedule Management</h3>
            <Card className="p-4">
              <div className="space-y-4">
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

                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />

                <Select
                  value={selectedShiftTime}
                  onValueChange={setSelectedShiftTime}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning Shift</SelectItem>
                    <SelectItem value="Afternoon">Afternoon Shift</SelectItem>
                    <SelectItem value="Evening">Evening Shift</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  className="w-full"
                  onClick={handleAddShift}
                  disabled={!selectedStaffId || !selectedDate}
                >
                  Add Shift
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};
