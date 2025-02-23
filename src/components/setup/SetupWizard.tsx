
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { LayoutTab } from "./tabs/LayoutTab";
import { MenuTab } from "./tabs/MenuTab";
import { StaffTab } from "./tabs/StaffTab";
import { PaymentTab } from "./tabs/PaymentTab";
import { KitchenTab } from "./tabs/KitchenTab";
import { SetupTabs } from "./components/SetupTabs";
import { SetupNavigation } from "./components/SetupNavigation";
import { useSetupWizard } from "./hooks/useSetupWizard";

export const SetupWizard = () => {
  const {
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
  } = useSetupWizard();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <Tabs value={currentStep} className="w-full">
        <SetupTabs />

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

      <SetupNavigation
        currentStep={currentStep}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onFinish={handleFinish}
      />
    </Card>
  );
};
