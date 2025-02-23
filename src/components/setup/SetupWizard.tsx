
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, ChefHat, DollarSign, MapPin, Menu } from "lucide-react";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { LayoutTab } from "./tabs/LayoutTab";
import { RestaurantInfo, LayoutInfo } from "./types";

export const SetupWizard = () => {
  const [currentStep, setCurrentStep] = useState("basic");
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
            <BasicInfoTab 
              restaurantInfo={restaurantInfo}
              setRestaurantInfo={setRestaurantInfo}
            />
          </TabsContent>

          <TabsContent value="layout">
            <LayoutTab 
              layoutInfo={layoutInfo}
              setLayoutInfo={setLayoutInfo}
            />
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
