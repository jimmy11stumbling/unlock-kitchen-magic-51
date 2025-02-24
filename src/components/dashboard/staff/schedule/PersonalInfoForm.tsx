
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import type { StaffMember } from "@/types/staff";

interface PersonalInfoFormProps {
  staff: StaffMember;
  onUpdateInfo: (updates: Partial<StaffMember>) => void;
}

export const PersonalInfoForm = ({ staff, onUpdateInfo }: PersonalInfoFormProps) => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={staff.name}
              onChange={(e) => onUpdateInfo({ name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={staff.email}
              onChange={(e) => onUpdateInfo({ email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={staff.phone}
              onChange={(e) => onUpdateInfo({ phone: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <Textarea
              value={staff.address}
              onChange={(e) => onUpdateInfo({ address: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Emergency Contact</label>
            <Input
              placeholder="Name"
              value={staff.emergencyContact.name}
              onChange={(e) => onUpdateInfo({
                emergencyContact: {
                  ...staff.emergencyContact,
                  name: e.target.value
                }
              })}
            />
            <Input
              className="mt-2"
              placeholder="Phone"
              value={staff.emergencyContact.phone}
              onChange={(e) => onUpdateInfo({
                emergencyContact: {
                  ...staff.emergencyContact,
                  phone: e.target.value
                }
              })}
            />
            <Input
              className="mt-2"
              placeholder="Relationship"
              value={staff.emergencyContact.relationship}
              onChange={(e) => onUpdateInfo({
                emergencyContact: {
                  ...staff.emergencyContact,
                  relationship: e.target.value
                }
              })}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
