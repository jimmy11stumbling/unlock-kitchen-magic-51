
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <Tabs value={currentStep} className="w-full">
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

        <TabsContent value="basic">
          <BasicInfoTab
            restaurantInfo={restaurantInfo}
            setRestaurantInfo={setRestaurantInfo}
            onValidationChange={(isValid) => handleValidationChange("basic", isValid)}
          />
        </TabsContent>
        
        <TabsContent value="layout">
          <LayoutTab
            layoutInfo={layoutInfo}
            setLayoutInfo={setLayoutInfo}
            onValidationChange={(isValid) => handleValidationChange("layout", isValid)}
          />
        </TabsContent>

        <TabsContent value="menu">
          <MenuTab
            menuInfo={menuInfo}
            setMenuInfo={setMenuInfo}
            onValidationChange={(isValid) => handleValidationChange("menu", isValid)}
          />
        </TabsContent>

        <TabsContent value="staff">
          <StaffTab
            staffInfo={staffInfo}
            setStaffInfo={setStaffInfo}
            onValidationChange={(isValid) => handleValidationChange("staff", isValid)}
          />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentTab
            paymentInfo={paymentInfo}
            setPaymentInfo={setPaymentInfo}
            onValidationChange={(isValid) => handleValidationChange("payment", isValid)}
          />
        </TabsContent>

        <TabsContent value="kitchen">
          <KitchenTab
            kitchenInfo={kitchenInfo}
            setKitchenInfo={setKitchenInfo}
            onValidationChange={(isValid) => handleValidationChange("kitchen", isValid)}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between p-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === "basic"}
        >
          Previous
        </Button>
        {currentStep === "kitchen" ? (
          <Button onClick={handleFinish}>Finish Setup</Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>
    </Card>
  );
};
