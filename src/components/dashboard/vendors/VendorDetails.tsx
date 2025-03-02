
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCcw } from "lucide-react";
import type { Vendor } from "@/types/vendor";
import { vendorService } from "./services/vendorService";
import { ContactsList } from "./ContactsList";
import { VendorNotes } from "./VendorNotes";
import { OrderHistory } from "./OrderHistory";
import { PaymentHistory } from "./PaymentHistory";
import { VendorDocuments } from "./VendorDocuments";

interface VendorDetailsProps {
  vendor: Vendor;
  onUpdate: () => void;
}

export const VendorDetails = ({ vendor, onUpdate }: VendorDetailsProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("contacts");
  const [contacts, setContacts] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTabData = async (tabId: string) => {
    setLoading(true);
    try {
      switch (tabId) {
        case "contacts":
          const contactsData = await vendorService.getVendorContacts(vendor.id);
          setContacts(contactsData);
          break;
        case "notes":
          const notesData = await vendorService.getVendorNotes(vendor.id);
          setNotes(notesData);
          break;
        case "orders":
          const ordersData = await vendorService.getVendorOrders(vendor.id);
          setOrders(ordersData);
          break;
        case "payments":
          const paymentsData = await vendorService.getVendorPayments(vendor.id);
          setPayments(paymentsData);
          break;
        case "documents":
          const docsData = await vendorService.getVendorDocuments(vendor.id);
          setDocuments(docsData);
          break;
      }
    } catch (error) {
      console.error(`Error fetching ${tabId}:`, error);
      toast({
        title: "Error",
        description: `Failed to load ${tabId}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, vendor.id]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleRefresh = () => {
    fetchTabData(activeTab);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{vendor.name}</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-semibold">Contact Information</h3>
          <p className="text-sm mt-1">{vendor.email || "No email provided"}</p>
          <p className="text-sm">{vendor.phone || "No phone provided"}</p>
          <p className="text-sm">{vendor.address || "No address provided"}</p>
        </div>
        <div>
          <h3 className="font-semibold">Business Details</h3>
          <p className="text-sm mt-1">Tax ID: {vendor.taxId || "Not provided"}</p>
          <p className="text-sm">Status: {vendor.status}</p>
        </div>
        <div>
          <h3 className="font-semibold">Payment Information</h3>
          <p className="text-sm mt-1">Payment Terms: {vendor.paymentTerms.replace("_", " ")}</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="pt-4">
          <ContactsList 
            vendorId={vendor.id} 
            onUpdate={() => fetchTabData("contacts")} 
          />
        </TabsContent>

        <TabsContent value="orders" className="pt-4">
          <OrderHistory 
            orders={orders} 
            vendorId={vendor.id} 
          />
        </TabsContent>

        <TabsContent value="payments" className="pt-4">
          <PaymentHistory 
            payments={payments} 
            vendorId={vendor.id} 
          />
        </TabsContent>

        <TabsContent value="documents" className="pt-4">
          <VendorDocuments 
            vendorId={vendor.id} 
            onUpdate={() => fetchTabData("documents")} 
          />
        </TabsContent>

        <TabsContent value="notes" className="pt-4">
          <VendorNotes 
            vendorId={vendor.id} 
            onUpdate={() => fetchTabData("notes")} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
