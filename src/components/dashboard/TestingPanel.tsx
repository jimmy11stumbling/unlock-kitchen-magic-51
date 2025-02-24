
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStressTest } from "@/hooks/useStressTest";
import { Loader2 } from "lucide-react";

export const TestingPanel = () => {
  const { isRunning, startTest } = useStressTest();

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">System Testing</h2>
        <p className="text-muted-foreground">
          Run comprehensive tests to verify system stability and performance.
        </p>
        <Button 
          onClick={startTest} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run Stress Test'
          )}
        </Button>
      </div>
    </Card>
  );
};
