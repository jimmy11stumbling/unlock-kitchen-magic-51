
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import type { StaffSetupInfo } from "../types";

interface StaffTabProps {
  staffInfo: StaffSetupInfo;
  setStaffInfo: (info: StaffSetupInfo) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const StaffTab = ({ staffInfo, setStaffInfo, onValidationChange }: StaffTabProps) => {
  const [newRole, setNewRole] = useState({ name: "", maxMembers: "" });
  const [newPermission, setNewPermission] = useState("");
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  const addRole = () => {
    if (newRole.name) {
      setStaffInfo({
        ...staffInfo,
        roles: [
          ...staffInfo.roles,
          {
            name: newRole.name,
            permissions: [],
            maxMembers: newRole.maxMembers ? Number(newRole.maxMembers) : null
          }
        ]
      });
      setNewRole({ name: "", maxMembers: "" });
    }
  };

  const addPermission = (roleIndex: number) => {
    if (newPermission && !staffInfo.roles[roleIndex].permissions.includes(newPermission)) {
      const updatedRoles = [...staffInfo.roles];
      updatedRoles[roleIndex].permissions.push(newPermission);
      setStaffInfo({ ...staffInfo, roles: updatedRoles });
      setNewPermission("");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Staff Roles</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              placeholder="Role name"
            />
            <Input
              type="number"
              value={newRole.maxMembers}
              onChange={(e) => setNewRole({ ...newRole, maxMembers: e.target.value })}
              placeholder="Max members (optional)"
            />
          </div>
          <Button onClick={addRole} className="w-full">Add Role</Button>

          <div className="mt-4 space-y-4">
            {staffInfo.roles.map((role, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{role.name}</h4>
                  {role.maxMembers && (
                    <Badge variant="secondary">Max: {role.maxMembers}</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newPermission}
                      onChange={(e) => setNewPermission(e.target.value)}
                      placeholder="Add permission"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addPermission(index);
                        }
                      }}
                    />
                    <Button onClick={() => addPermission(index)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission, pIndex) => (
                      <Badge key={pIndex} variant="outline">
                        {permission}
                        <button
                          onClick={() => {
                            const updatedRoles = [...staffInfo.roles];
                            updatedRoles[index].permissions = updatedRoles[index].permissions.filter(
                              (_, i) => i !== pIndex
                            );
                            setStaffInfo({ ...staffInfo, roles: updatedRoles });
                          }}
                          className="ml-2"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Schedule Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Shifts per Day</label>
              <Input
                type="number"
                value={staffInfo.schedulePreferences.shiftsPerDay}
                onChange={(e) => setStaffInfo({
                  ...staffInfo,
                  schedulePreferences: {
                    ...staffInfo.schedulePreferences,
                    shiftsPerDay: Number(e.target.value)
                  }
                })}
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Minimum Hours per Shift</label>
              <Input
                type="number"
                value={staffInfo.schedulePreferences.minHoursPerShift}
                onChange={(e) => setStaffInfo({
                  ...staffInfo,
                  schedulePreferences: {
                    ...staffInfo.schedulePreferences,
                    minHoursPerShift: Number(e.target.value)
                  }
                })}
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Maximum Hours per Week</label>
              <Input
                type="number"
                value={staffInfo.schedulePreferences.maxHoursPerWeek}
                onChange={(e) => setStaffInfo({
                  ...staffInfo,
                  schedulePreferences: {
                    ...staffInfo.schedulePreferences,
                    maxHoursPerWeek: Number(e.target.value)
                  }
                })}
                min="1"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
