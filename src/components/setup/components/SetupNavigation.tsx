
import { Button } from "@/components/ui/button";

interface SetupNavigationProps {
  currentStep: string;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
}

export const SetupNavigation = ({
  currentStep,
  onPrevious,
  onNext,
  onFinish
}: SetupNavigationProps) => {
  return (
    <div className="flex justify-between p-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === "basic"}
      >
        Previous
      </Button>
      {currentStep === "kitchen" ? (
        <Button onClick={onFinish}>Finish Setup</Button>
      ) : (
        <Button onClick={onNext}>Next</Button>
      )}
    </div>
  );
};
