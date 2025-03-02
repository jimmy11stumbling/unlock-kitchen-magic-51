
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Pencil, FileText, Calendar, DollarSign } from "lucide-react";
import type { Vendor } from "@/types/vendor";
import { vendorService } from "./services/vendorService";
import { OrderHistory } from "./OrderHistory";
import { PaymentHistory } from "./PaymentHistory";
import { ContactsList } from "./ContactsList";
import { VendorNotes } from "./VendorNotes";
import { VendorDocuments } from "./VendorDocuments";

interface VendorDetailsProps {
  vendor: Vendor;
  onUpdate: () => void;
}

export const VendorDetails = ({ vendor, onUpdate }: VendorDetailsProps) => {
  const [activeTab, setActiveTab] = useState("details");

  const { data: vendorOrders } = useQuery({
    queryKey: ["vendor-orders", vendor.id],
    queryFn: () => vendorService.getVendorOrders(vendor.id)
  });

  const { data: vendorPayments } = useQuery({
    queryKey: ["vendor-payments", vendor.id],
    queryFn: () => vendorService.getVendorPayments(vendor.id)
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{vendor.name}</h2>
          <p className="text-muted-foreground">
            {vendor.status === "active" ? "Active Vendor" : "Inactive Vendor"}
          </p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {vendor.email && <p><strong>Email:</strong> {vendor.email}</p>}
                  {vendor.phone && <p><strong>Phone:</strong> {vendor.phone}</p>}
                  {vendor.address && <p><strong>Address:</strong> {vendor.address}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Financial Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Tax ID:</strong> {vendor.taxId || "Not provided"}</p>
                  <p><strong>Payment Terms:</strong> {vendor.paymentTerms}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Vendor Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Status:</strong> {vendor.status}</p>
                  <p><strong>Created:</strong> {new Date(vendor.createdAt).toLocaleDateString()}</p>
                  <p><strong>Last Updated:</strong> {new Date(vendor.updatedAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <OrderHistory orders={vendorOrders || []} vendorId={vendor.id} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentHistory payments={vendorPayments || []} vendorId={vendor.id} />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactsList vendorId={vendor.id} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="documents">
          <VendorDocuments vendorId={vendor.id} />
        </TabsContent>

        <TabsContent value="notes">
          <VendorNotes vendor={vendor} onUpdate={onUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
