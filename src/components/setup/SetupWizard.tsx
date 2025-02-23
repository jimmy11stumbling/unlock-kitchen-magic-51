
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAvailableStates } from "@/utils/taxCalculator";
import { Clock, Users, ChefHat, DollarSign, MapPin, Menu } from "lucide-react";

interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  state: string;
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
}

interface LayoutInfo {
  sections: {
    name: string;
    tables: number;
  }[];
  defaultCapacities: number[];
}

interface MenuInfo {
  categories: string[];
  mealPeriods: string[];
  specialMenus: string[];
}

interface StaffInfo {
  roles: string[];
  shifts: string[];
}

interface PaymentInfo {
  methods: string[];
  tipPresets: number[];
  autoGratuity: boolean;
  autoGratuityThreshold: number;
}

interface KitchenInfo {
  stations: string[];
  printers: string[];
  averagePrepTimes: {
    [category: string]: number;
  };
}

export const SetupWizard = () => {
  const [currentStep, setCurrentStep] = useState("basic");
  const states = getAvailableStates();
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

  const handleSave = () => {
    // Save all information to your state management system
    console.log("Saving restaurant configuration:", {
      restaurantInfo,
      layoutInfo
    });
  };

  return (
    <Dialog>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">Restaurant Setup Wizard</DialogTitle>
        </DialogHeader>

        <Tabs value={currentStep} onValueChange={setCurrentStep}>
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="basic" className="flex flex-col items-center gap-2 p-4">
              <MapPin className="h-5 w-5" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex flex-col items-center gap-2 p-4">
              <Menu className="h-5 w-5" />
              <span>Layout</span>
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex flex-col items-center gap-2 p-4">
              <ChefHat className="h-5 w-5" />
              <span>Menu</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex flex-col items-center gap-2 p-4">
              <Users className="h-5 w-5" />
              <span>Staff</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex flex-col items-center gap-2 p-4">
              <DollarSign className="h-5 w-5" />
              <span>Payment</span>
            </TabsTrigger>
            <TabsTrigger value="kitchen" className="flex flex-col items-center gap-2 p-4">
              <Clock className="h-5 w-5" />
              <span>Kitchen</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Restaurant Name</label>
                  <Input
                    value={restaurantInfo.name}
                    onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
                    placeholder="Enter restaurant name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Textarea
                    value={restaurantInfo.address}
                    onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
                    placeholder="Enter full address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={restaurantInfo.phone}
                      onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={restaurantInfo.email}
                      onChange={(e) => setRestaurantInfo({ ...restaurantInfo, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Select
                    value={restaurantInfo.state}
                    onValueChange={(value) => setRestaurantInfo({ ...restaurantInfo, state: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Business Hours</label>
                  <div className="space-y-2">
                    {daysOfWeek.map((day) => (
                      <div key={day} className="grid grid-cols-3 gap-2 items-center">
                        <span className="capitalize">{day}</span>
                        <Input
                          type="time"
                          value={restaurantInfo.businessHours[day].open}
                          onChange={(e) => setRestaurantInfo({
                            ...restaurantInfo,
                            businessHours: {
                              ...restaurantInfo.businessHours,
                              [day]: { ...restaurantInfo.businessHours[day], open: e.target.value }
                            }
                          })}
                        />
                        <Input
                          type="time"
                          value={restaurantInfo.businessHours[day].close}
                          onChange={(e) => setRestaurantInfo({
                            ...restaurantInfo,
                            businessHours: {
                              ...restaurantInfo.businessHours,
                              [day]: { ...restaurantInfo.businessHours[day], close: e.target.value }
                            }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="layout">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Sections</label>
                  {layoutInfo.sections.map((section, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 mb-2">
                      <Input
                        value={section.name}
                        onChange={(e) => {
                          const newSections = [...layoutInfo.sections];
                          newSections[index].name = e.target.value;
                          setLayoutInfo({ ...layoutInfo, sections: newSections });
                        }}
                        placeholder="Section name"
                      />
                      <Input
                        type="number"
                        value={section.tables}
                        onChange={(e) => {
                          const newSections = [...layoutInfo.sections];
                          newSections[index].tables = Number(e.target.value);
                          setLayoutInfo({ ...layoutInfo, sections: newSections });
                        }}
                        placeholder="Number of tables"
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => setLayoutInfo({
                      ...layoutInfo,
                      sections: [...layoutInfo.sections, { name: "", tables: 0 }]
                    })}
                  >
                    Add Section
                  </Button>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Default Table Capacities</label>
                  <div className="flex flex-wrap gap-2">
                    {layoutInfo.defaultCapacities.map((capacity, index) => (
                      <Input
                        key={index}
                        type="number"
                        className="w-20"
                        value={capacity}
                        onChange={(e) => {
                          const newCapacities = [...layoutInfo.defaultCapacities];
                          newCapacities[index] = Number(e.target.value);
                          setLayoutInfo({ ...layoutInfo, defaultCapacities: newCapacities });
                        }}
                      />
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setLayoutInfo({
                        ...layoutInfo,
                        defaultCapacities: [...layoutInfo.defaultCapacities, 2]
                      })}
                    >
                      Add Capacity
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <Card className="p-6">
              <div className="text-center text-muted-foreground">
                Menu configuration will be implemented in the next phase
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card className="p-6">
              <div className="text-center text-muted-foreground">
                Staff configuration will be implemented in the next phase
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card className="p-6">
              <div className="text-center text-muted-foreground">
                Payment configuration will be implemented in the next phase
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="kitchen">
            <Card className="p-6">
              <div className="text-center text-muted-foreground">
                Kitchen configuration will be implemented in the next phase
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => {
              const steps = ["basic", "layout", "menu", "staff", "payment", "kitchen"];
              const currentIndex = steps.indexOf(currentStep);
              if (currentIndex > 0) {
                setCurrentStep(steps[currentIndex - 1]);
              }
            }}
            disabled={currentStep === "basic"}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              const steps = ["basic", "layout", "menu", "staff", "payment", "kitchen"];
              const currentIndex = steps.indexOf(currentStep);
              if (currentIndex < steps.length - 1) {
                setCurrentStep(steps[currentIndex + 1]);
              } else {
                handleSave();
              }
            }}
          >
            {currentStep === "kitchen" ? "Finish Setup" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
