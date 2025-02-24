
import { Card } from "@/components/ui/card";
import type { Vendor } from "@/types/vendor";

interface VendorListProps {
  vendors: Vendor[];
  searchTerm: string;
}

export const VendorList = ({ vendors, searchTerm }: VendorListProps) => {
  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-md border">
      {filteredVendors.length === 0 ? (
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            {searchTerm ? "No vendors match your search." : "No vendors found. Add your first vendor to get started."}
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="p-4 hover:bg-muted/50">
              <h3 className="font-medium">{vendor.name}</h3>
              <p className="text-sm text-muted-foreground">{vendor.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
