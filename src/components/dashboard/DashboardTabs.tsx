
import { ReactNode } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
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
      <Link to="/dashboard/overview">
        <TabsTrigger value="overview" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Overview
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/daily-reports">
        <TabsTrigger value="daily-reports" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
          <FileText className="h-4 w-4 mr-2" />
          Daily Reports
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/orders">
        <TabsTrigger value="orders" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Orders
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/reservations">
        <TabsTrigger value="reservations" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
          <Calendar className="h-4 w-4 mr-2" />
          Reservations
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/staff">
        <TabsTrigger value="staff" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
          <Users className="h-4 w-4 mr-2" />
          Staff
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/inventory">
        <TabsTrigger value="inventory" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
          <Box className="h-4 w-4 mr-2" />
          Inventory
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/analytics">
        <TabsTrigger value="analytics" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
          <BarChart className="h-4 w-4 mr-2" />
          Analytics
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/settings">
        <TabsTrigger value="settings" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/menu">
        <TabsTrigger value="menu" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
          Menu
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/tables">
        <TabsTrigger value="tables" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
          Tables
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/kitchen">
        <TabsTrigger value="kitchen" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
          <ChefHat className="h-4 w-4 mr-2" />
          Kitchen
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/feedback">
        <TabsTrigger value="feedback" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
          <MessageSquare className="h-4 w-4 mr-2" />
          Feedback
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/promotions">
        <TabsTrigger value="promotions" className="data-[state=active]:bg-background dark:data-[state=active]:bg-muted">
          <Tags className="h-4 w-4 mr-2" />
          Promotions
        </TabsTrigger>
      </Link>
    </TabsList>
  );
};
