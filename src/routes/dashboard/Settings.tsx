
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleManagement } from "@/components/dashboard/roles/RoleManagement";
import { SubscriptionManagement } from "@/components/dashboard/subscriptions/SubscriptionManagement";
import { Settings as SettingsIcon, Shield, CreditCard } from "lucide-react";

const Settings = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Subscriptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-6">
          <RoleManagement />
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-6">
          <SubscriptionManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
