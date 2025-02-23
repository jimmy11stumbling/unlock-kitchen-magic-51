
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, ChefHat, DollarSign, MapPin, Menu } from "lucide-react";

export const SetupTabs = () => {
  return (
    <TabsList className="grid grid-cols-6 w-full">
      <TabsTrigger value="basic">
        <MapPin className="h-4 w-4 mr-2" />
        Basic
      </TabsTrigger>
      <TabsTrigger value="layout">
        <Menu className="h-4 w-4 mr-2" />
        Layout
      </TabsTrigger>
      <TabsTrigger value="menu">
        <ChefHat className="h-4 w-4 mr-2" />
        Menu
      </TabsTrigger>
      <TabsTrigger value="staff">
        <Users className="h-4 w-4 mr-2" />
        Staff
      </TabsTrigger>
      <TabsTrigger value="payment">
        <DollarSign className="h-4 w-4 mr-2" />
        Payment
      </TabsTrigger>
      <TabsTrigger value="kitchen">
        <Clock className="h-4 w-4 mr-2" />
        Kitchen
      </TabsTrigger>
    </TabsList>
  );
};
