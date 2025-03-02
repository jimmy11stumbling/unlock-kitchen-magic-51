import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";

export interface PersonalInfoFormProps {
  staffMember: StaffMember;
  onUpdate: (updates: Partial<StaffMember>) => void;
}

export const PersonalInfoForm = ({ staffMember, onUpdate }: PersonalInfoFormProps) => {
  const [formData, setFormData] = useState({
    name: staffMember.name,
    email: staffMember.email || "",
    phone: staffMember.phone || "",
    address: staffMember.address || "",
    emergencyContact: {
      name: staffMember.emergencyContact?.name || "",
      phone: staffMember.emergencyContact?.phone || "",
      relationship: staffMember.emergencyContact?.relationship || ""
    },
    notes: staffMember.notes || ""
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmergencyContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      notes: formData.notes
    });
    toast({
      title: "Information Updated",
      description: "Staff member's personal information has been updated."
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="text-lg font-medium">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input 
                  name="name" 
                  value={formData.emergencyContact.name} 
                  onChange={handleEmergencyContactChange}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input 
                  name="phone" 
                  value={formData.emergencyContact.phone} 
                  onChange={handleEmergencyContactChange}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Relationship</label>
                <Input 
                  name="relationship" 
                  value={formData.emergencyContact.relationship} 
                  onChange={handleEmergencyContactChange}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>
            
            <Button type="submit" className="w-full md:w-auto">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
