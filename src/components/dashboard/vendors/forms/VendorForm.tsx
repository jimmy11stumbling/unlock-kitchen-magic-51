
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { Vendor } from "@/types/vendor";
import { vendorService } from "../services/vendorService";

interface VendorFormProps {
  vendor?: Vendor;
  onClose: () => void;
  onSubmit: () => void;
}

export const VendorForm = ({ vendor, onClose, onSubmit }: VendorFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: vendor?.name || "",
    email: vendor?.email || "",
    phone: vendor?.phone || "",
    address: vendor?.address || "",
    taxId: vendor?.taxId || "",
    paymentTerms: vendor?.paymentTerms || "",
    notes: vendor?.notes || "",
    status: vendor?.status || "active"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (vendor) {
        await vendorService.updateVendor(vendor.id, formData);
        toast({ title: "Vendor updated successfully" });
      } else {
        await vendorService.addVendor(formData);
        toast({ title: "Vendor added successfully" });
      }
      onSubmit();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save vendor",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Vendor Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <Textarea
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
      />
      <Input
        placeholder="Tax ID"
        value={formData.taxId}
        onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
      />
      <Input
        placeholder="Payment Terms"
        value={formData.paymentTerms}
        onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
      />
      <Textarea
        placeholder="Notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : vendor ? "Update Vendor" : "Add Vendor"}
        </Button>
      </div>
    </form>
  );
};
