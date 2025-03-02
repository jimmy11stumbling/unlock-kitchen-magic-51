
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { Vendor } from "@/types/vendor";
import { vendorService } from "../services/vendorService";

interface VendorFormProps {
  vendor?: Vendor;
  onClose: () => void;
  onSuccess: () => void;
}

export const VendorForm = ({ vendor, onClose, onSuccess }: VendorFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<Vendor, "id" | "createdAt" | "updatedAt">>({
    name: vendor?.name || "",
    email: vendor?.email || "",
    phone: vendor?.phone || "",
    address: vendor?.address || "",
    taxId: vendor?.taxId || "",
    status: vendor?.status || "active",
    paymentTerms: vendor?.paymentTerms || "net_30",
    notes: vendor?.notes || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (vendor) {
        await vendorService.updateVendor(vendor.id.toString(), formData);
        toast({
          title: "Vendor updated",
          description: "Vendor information has been updated successfully"
        });
      } else {
        await vendorService.addVendor(formData);
        toast({
          title: "Vendor added",
          description: "New vendor has been added successfully"
        });
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: vendor ? "Failed to update vendor" : "Failed to add vendor",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Vendor Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter vendor name"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Vendor address"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxId">Tax ID</Label>
          <Input
            id="taxId"
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
            placeholder="Tax ID or Business Number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="paymentTerms">Payment Terms</Label>
        <Select
          value={formData.paymentTerms}
          onValueChange={(value) => handleSelectChange("paymentTerms", value)}
        >
          <SelectTrigger id="paymentTerms">
            <SelectValue placeholder="Select payment terms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="prepaid">Prepaid</SelectItem>
            <SelectItem value="cod">Cash on Delivery</SelectItem>
            <SelectItem value="net_7">Net 7</SelectItem>
            <SelectItem value="net_15">Net 15</SelectItem>
            <SelectItem value="net_30">Net 30</SelectItem>
            <SelectItem value="net_60">Net 60</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about this vendor"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {vendor ? "Update Vendor" : "Add Vendor"}
        </Button>
      </div>
    </form>
  );
};
