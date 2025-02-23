
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, ChefHat, DollarSign, MapPin, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { LayoutTab } from "./tabs/LayoutTab";
import { MenuTab } from "./tabs/MenuTab";
import { StaffTab } from "./tabs/StaffTab";
import { PaymentTab } from "./tabs/PaymentTab";
import { KitchenTab } from "./tabs/KitchenTab";
import type { RestaurantInfo, LayoutInfo, MenuSetupInfo, StaffSetupInfo, PaymentSetupInfo, KitchenSetupInfo } from "./types";

export const SetupWizard = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState("basic");
  const [tabValidation, setTabValidation] = useState<Record<string, boolean>>({
    basic: false,
    layout: false,
    menu: false,
    staff: false,
    payment: false,
    kitchen: false
  });
  
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: "",
    address: "",
    phone: "",
    email: "",
    state: "California",
    businessHours: daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day]: { open: "09:00", close: "22:00" }
    }), {})
  });

  const [layoutInfo, setLayoutInfo] = useState<LayoutInfo>({
    sections: [
      { name: "Indoor", tables: 10 },
      { name: "Outdoor", tables: 5 },
      { name: "Bar", tables: 3 }
    ],
    defaultCapacities: [2, 4, 6, 8]
  });

  const [menuInfo, setMenuInfo] = useState<MenuSetupInfo>({
    categories: ["Appetizers", "Main Course", "Desserts", "Beverages"],
    itemDefaults: {
      preparationTime: 15,
      allergenOptions: ["Gluten", "Dairy", "Nuts", "Shellfish", "Soy"]
    },
    inventory: {
      trackInventory: true,
      lowStockAlerts: true,
      autoReorder: false
    }
  });

  const [staffInfo, setStaffInfo] = useState<StaffSetupInfo>({
    roles: [
      {
        name: "Manager",
        permissions: ["manage_staff", "view_reports", "modify_menu"],
        maxMembers: 2
      },
      {
        name: