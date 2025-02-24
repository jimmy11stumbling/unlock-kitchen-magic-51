
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, FileText, Settings } from "lucide-react";

export const PayrollTabs = () => {
  return (
    <TabsList>
      <TabsTrigger value="process" className="flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
        Process Payroll
      </TabsTrigger>
      <TabsTrigger value="history" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Payroll History
      </TabsTrigger>
      <TabsTrigger value="settings" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Settings
      </TabsTrigger>
    </TabsList>
  );
};
