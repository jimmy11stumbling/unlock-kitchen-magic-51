
import { PromotionsPanel } from "@/components/dashboard/PromotionsPanel";
import { useDashboardState } from "@/hooks/useDashboardState";

const Promotions = () => {
  const { promotions, addPromotion, togglePromotion } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Promotions</h1>
      <PromotionsPanel
        promotions={promotions}
        onAddPromotion={addPromotion}
        onTogglePromotion={togglePromotion}
      />
    </div>
  );
};

export default Promotions;
