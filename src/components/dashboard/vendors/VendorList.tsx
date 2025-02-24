
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import type { Vendor } from "@/types/vendor";

interface VendorListProps {
  vendors: Vendor[];
  searchTerm: string;
  onUpdate: () => void;
}

export const VendorList = ({ vendors, searchTerm, onUpdate }: VendorListProps) => {
  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {filteredVendors.length === 0 ? (
        <Card className="p-6">
          <p className="text-center text-muted-foreground">No vendors found</p>
        </Card>
      ) : (
        filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">{vendor.name}</h3>
                <p className="text-sm text-muted-foreground">{vendor.email}</p>
                <p className="text-sm">{vendor.phone}</p>
                <p className="text-sm text-muted-foreground">{vendor.address}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                    {vendor.status}
                  </Badge>
                  <Badge variant="outline">{vendor.paymentTerms}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
