
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart,
  Users,
  LayoutDashboard,
  Box,
  Settings,
  Calendar,
  ChefHat,
  MessageSquare,
  Tags,
  FileText,
  Menu as MenuIcon,
  LayoutGrid,
} from "lucide-react";

export const DashboardTabs = () => {
  const location = useLocation();
  const currentTab = location.pathname.split('/')[2] || 'overview';

  return (
    <TabsList className="flex flex-wrap gap-2">
      <Link to="/dashboard/overview">
        <TabsTrigger value="overview" className={`data-[state=active]:bg-background dark:data-[state=active]:bg-muted ${currentTab === 'overview' ? 'bg-background dark:bg-muted' : ''}`}>
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Overview
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/daily-reports">
        <TabsTrigger value="daily-reports" className={`data-[state=active]:bg-background dark:data-[state=active]:bg-muted ${currentTab === 'daily-reports' ? 'bg-background dark:bg-muted' : ''}`}>
          <FileText className="h-4 w-4 mr-2" />
          Daily Reports
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/reservations">
        <TabsTrigger value="reservations" className={`data-[state=active]:bg-background dark:data-[state=active]:bg-muted ${currentTab === 'reservations' ? 'bg-background dark:bg-muted' : ''}`}>
          <Calendar className="h-4 w-4 mr-2" />
          Reservations
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/staff">
        <TabsTrigger value="staff" className={`data-[state=active]:bg-background dark:data-[state=active]:bg-muted ${currentTab === 'staff' ? 'bg-background dark:bg-muted' : ''}`}>
          <Users className="h-4 w-4 mr-2" />
          Staff
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/inventory">
        <TabsTrigger value="inventory" className={`data-[state=active]:bg-background dark:data-[state=active]:bg-muted ${currentTab === 'inventory' ? 'bg-background dark:bg-muted' : ''}`}>
          <Box className="h-4 w-4 mr-2" />
          Inventory
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/analytics">
        <TabsTrigger value="analytics" className={`data-[state=active]:bg-background dark:data-[state=active]:bg-muted ${currentTab === 'analytics' ? 'bg-background dark:bg-muted' : ''}`}>
          <BarChart className="h-4 w-4 mr-2" />
          Analytics
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/menu">
        <TabsTrigger value="menu" className={`data-[state=active]:bg-background dark:data-[state=active]:bg-muted ${currentTab === 'menu' ? 'bg-background dark:bg-muted' : ''}`}>
          <MenuIcon className="h-4 w-4 mr-2" />
          Menu
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/tables">
        <TabsTrigger value="tables" className={`data-[state=active]:bg-background dark:data-[state=active]:bg-muted ${currentTab === 'tables' ? 'bg-background dark:bg-muted' : ''}`}>
          <LayoutGrid className="h-4 w-4 mr-2" />
          Tables
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/kitchen">
        <TabsTrigger value="kitchen" className={`data-[state=active]:bg-background dark:data-[state=active]:bg-muted ${currentTab === 'kitchen' ? 'bg-background dark:bg-muted' : ''}`}>
          <ChefHat className="h-4 w-4 mr-2" />
          Kitchen
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/feedback">
        <TabsTrigger value="feedback" className={`data-[state=active]:bg-background dark:data-[state=active]:bg-muted ${currentTab === 'feedback' ? 'bg-background dark:bg-muted' : ''}`}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Feedback
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/promotions">
        <TabsTrigger value="promotions" className={`data-[state=active]:bg-background dark:data-[state=active]:bg-muted ${currentTab === 'promotions' ? 'bg-background dark:bg-muted' : ''}`}>
          <Tags className="h-4 w-4 mr-2" />
          Promotions
        </TabsTrigger>
      </Link>
      <Link to="/dashboard/settings">
        <TabsTrigger value="settings" className={`data-[state=active]:bg-background dark:data-[state=active]:bg-muted ${currentTab === 'settings' ? 'bg-background dark:bg-muted' : ''}`}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </TabsTrigger>
      </Link>
    </TabsList>
  );
};
