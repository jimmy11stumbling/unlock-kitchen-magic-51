
import { useState } from 'react';
import { runStressTest } from '@/utils/testing/appStressTest';
import { useToast } from '@/components/ui/use-toast';

export const useStressTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const startTest = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    toast({
      title: "Starting Stress Test",
      description: "The application will now undergo a comprehensive stress test. Check the console for detailed results.",
    });

    try {
      await runStressTest();
      
      toast({
        title: "Stress Test Completed",
        description: "Check the console for detailed test results and performance metrics.",
      });
    } catch (error) {
      toast({
        title: "Stress Test Failed",
        description: "An error occurred during the stress test. Check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return {
    isRunning,
    startTest,
  };
};
