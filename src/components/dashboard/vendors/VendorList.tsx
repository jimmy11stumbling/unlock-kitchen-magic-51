
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash2, FileClock, Eye } from "lucide-react";
import type { Vendor } from "@/types/vendor";
import { VendorForm } from "./forms/VendorForm";
import { vendorService } from "./services/vendorService";
import { VendorDetails } from "./VendorDetails";

interface VendorListProps {
  vendors: Vendor[];
  searchTerm: string;
  onUpdate: () => void;
}

export const VendorList = ({ vendors, searchTerm, onUpdate }: VendorListProps) => {
  const [showUpdateVendor, setShowUpdateVendor] = useState(false);
  const [showVendorDetails, setShowVendorDetails] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filteredVendors = vendors.filter((vendor) =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.paymentTerms.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowUpdateVendor(true);
  };

  const handleViewDetails = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowVendorDetails(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await vendorService.deleteVendor(id.toString());
      toast({
        title: "Vendor deleted",
        description: "Vendor has been removed successfully"
      });
      onUpdate();
      setConfirmDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vendor",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Tax ID</TableHead>
              <TableHead>Payment Terms</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No vendors found
                </TableCell>
              </TableRow>
            ) : (
              filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>
                    {vendor.email && (
                      <div className="text-sm">{vendor.email}</div>
                    )}
                    {vendor.phone && (
                      <div className="text-sm text-muted-foreground">{vendor.phone}</div>
                    )}
                  </TableCell>
                  <TableCell>{vendor.taxId || "—"}</TableCell>
                  <TableCell>{vendor.paymentTerms}</TableCell>
                  <TableCell>
                    <Badge
                      variant={vendor.status === "active" ? "default" : "secondary"}
                    >
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(vendor)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(vendor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDelete(vendor.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Vendor Dialog */}
      <Dialog open={showUpdateVendor} onOpenChange={setShowUpdateVendor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Vendor</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <VendorForm
              vendor={selectedVendor}
              onClose={() => setShowUpdateVendor(false)}
              onSuccess={onUpdate}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Vendor Details Dialog */}
      <Dialog open={showVendorDetails} onOpenChange={setShowVendorDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <VendorDetails 
              vendor={selectedVendor} 
              onUpdate={onUpdate} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDelete !== null} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this vendor? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => confirmDelete && handleDelete(confirmDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
