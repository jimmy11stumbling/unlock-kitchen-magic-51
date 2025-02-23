
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { 
  RestaurantInfo, 
  LayoutInfo, 
  MenuSetupInfo, 
  StaffSetupInfo, 
  PaymentSetupInfo, 
  KitchenSetupInfo 
} from "../types";

export const useSetupWizard = () => {
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
        name: "Server",
        permissions: ["take_orders", "process_payments"],
        maxMembers: 10
      },
      {
        name: "Chef",
        permissions: ["manage_kitchen", "view_orders"],
        maxMembers: 5
      }
    ],
    schedulePreferences: {
      shiftsPerDay: 3,
      minHoursPerShift: 4,
      maxHoursPerWeek: 40
    }
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentSetupInfo>({
    methods: [
      { type: "cash", enabled: true },
      { type: "card", enabled: true },
      { type: "mobile", enabled: true }
    ],
    taxRate: 8.5,
    gratuityOptions: [15, 18, 20, 22],
    autoGratuity: {
      enabled: true,
      partySize: 6,
      percentage: 18
    }
  });

  const [kitchenInfo, setKitchenInfo] = useState<KitchenSetupInfo>({
    stations: ["Grill", "Prep", "Fry", "Salad"],
    printerLocations: ["Kitchen", "Bar", "Service"],
    preparationAlerts: {
      enabled: true,
      timeThreshold: 20
    },
    displayPreferences: {
      groupByCategory: true,
      showTimers: true,
      showNotes: true
    }
  });

  const handleValidationChange = (tab: string, isValid: boolean) => {
    setTabValidation(prev => ({
      ...prev,
      [tab]: isValid
    }));
  };

  const handleNext = () => {
    const steps = ["basic", "layout", "menu", "staff", "payment", "kitchen"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const steps = ["basic", "layout", "menu", "staff", "payment", "kitchen"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleFinish = () => {
    const isValid = Object.values(tabValidation).every(v => v);
    if (isValid) {
      toast({
        title: "Setup Complete",
        description: "Your restaurant has been configured successfully.",
      });
    } else {
      toast({
        title: "Validation Error",
        description: "Please complete all required fields in each section.",
        variant: "destructive"
      });
    }
  };

  return {
    currentStep,
    restaurantInfo,
    setRestaurantInfo,
    layoutInfo,
    setLayoutInfo,
    menuInfo,
    setMenuInfo,
    staffInfo,
    setStaffInfo,
    paymentInfo,
    setPaymentInfo,
    kitchenInfo,
    setKitchenInfo,
    handleValidationChange,
    handleNext,
    handlePrevious,
    handleFinish
  };
};
