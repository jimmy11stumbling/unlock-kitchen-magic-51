
import { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  initializeWithSimulationData, 
  getSimulationData, 
  clearSimulationData 
} from '@/utils/simulationData';

export const useSimulationData = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkInitialization = () => {
      const storedData = localStorage.getItem('simulationData');
      setIsInitialized(!!storedData);
      setLoading(false);
    };

    checkInitialization();
  }, []);

  const initialize = () => {
    try {
      setLoading(true);
      const data = initializeWithSimulationData();
      setIsInitialized(true);
      toast({
        title: "Simulation Data Initialized",
        description: `Successfully loaded ${Object.keys(data).length} data categories for testing.`,
      });
      return data;
    } catch (error) {
      console.error("Error initializing simulation data:", error);
      toast({
        title: "Initialization Error",
        description: "Failed to initialize simulation data.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    try {
      setLoading(true);
      clearSimulationData();
      setIsInitialized(false);
      toast({
        title: "Simulation Data Reset",
        description: "All simulation data has been cleared.",
      });
    } catch (error) {
      console.error("Error resetting simulation data:", error);
      toast({
        title: "Reset Error",
        description: "Failed to reset simulation data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getData = () => {
    if (!isInitialized) {
      return null;
    }
    return getSimulationData();
  };

  return {
    isInitialized,
    loading,
    initialize,
    reset,
    getData
  };
};
