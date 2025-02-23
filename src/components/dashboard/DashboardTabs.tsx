
import { ReactNode } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Users,
  ShoppingCart,
  LayoutDashboard,
  Box,
  Settings,
  Calendar,
  ChefHat,
  MessageSquare,
  Tags,
  FileText,
} from "lucide-react";

export const DashboardTabs = () => {
  return (
    <TabsList className="bg-muted/50 dark:bg-muted/20">
      <TabsTrigger value="overview" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
        <LayoutDashboard className="h-4 w-4 mr-2" />
        Overview
      </TabsTrigger>
      <TabsTrigger value="daily-reports" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
        <FileText className="h-4 w-4 mr-2" />
        Daily Reports
      </TabsTrigger>
      <TabsTrigger value="orders" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
        <ShoppingCart className="h-4 w-4 mr-2" />
        Orders
      </TabsTrigger>
      <TabsTrigger value="reservations" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
        <Calendar className="h-4 w-4 mr-2" />
        Reservations
      </TabsTrigger>
      <TabsTrigger value="staff" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
        <Users className="h-4 w-4 mr-2" />
        Staff
      </TabsTrigger>
      <TabsTrigger value="inventory" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
        <Box className="h-4 w-4 mr-2" />
        Inventory
      </TabsTrigger>
      <TabsTrigger value="analytics" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
        <BarChart className="h-4 w-4 mr-2" />
        Analytics
      </TabsTrigger>
      <TabsTrigger value="settings" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </TabsTrigger>
      <TabsTrigger value="menu" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
        Menu
      </TabsTrigger>
      <TabsTrigger value="tables" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
        Tables
      </TabsTrigger>
      <TabsTrigger value="kitchen" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
        <ChefHat className="h-4 w-4 mr-2" />
        Kitchen
      </TabsTrigger>
      <TabsTrigger value="feedback" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
        <MessageSquare className="h-4 w-4 mr-2" />
        Feedback
      </TabsTrigger>
      <TabsTrigger value="promotions" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
        <Tags className="h-4 w-4 mr-2" />
        Promotions
      </TabsTrigger>
    </TabsList>
  );
};
