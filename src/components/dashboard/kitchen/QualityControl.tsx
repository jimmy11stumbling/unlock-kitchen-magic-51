
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface QualityCheck {
  id: number;
  station: string;
  temperature: number;
  cleanliness: 'pass' | 'fail';
  foodSafety: 'pass' | 'fail';
  timestamp: string;
  checkedBy: string;
  notes?: string;
}

export function QualityControl() {
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchQualityChecks();
    const interval = setInterval(fetchQualityChecks, 900000); // Update every 15 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchQualityChecks = async () => {
    try {
      // In a real application, this would fetch from a quality_checks table
      // For now, we'll simulate some quality check data
      const mockChecks: QualityCheck[] = [
        {
          id: 1,
          station: "Grill Station",
          temperature: 165,
          cleanliness: 'pass',
          foodSafety: 'pass',
          timestamp: new Date().toISOString(),
          checkedBy: "John Doe",
          notes: "All equipment properly sanitized"
        },
        {
          id: 2,
          station: "Prep Station",
          temperature: 38,
          cleanliness: 'pass',
          foodSafety: 'pass',
          timestamp: new Date().toISOString(),
          checkedBy: "Jane Smith",
        }
      ];

      setQualityChecks(mockChecks);
    } catch (error) {
      console.error('Error fetching quality checks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quality check data",
        variant: "destructive",
      });
    }
  };

  const performQualityCheck = async (station: string) => {
    try {
      const newCheck: QualityCheck = {
        id: Date.now(),
        station,
        temperature: Math.round(Math.random() * (180 - 160) + 160),
        cleanliness: Math.random() > 0.1 ? 'pass' : 'fail',
        foodSafety: Math.random() > 0.1 ? 'pass' : 'fail',
        timestamp: new Date().toISOString(),
        checkedBy: "Current User", // In a real app, this would be the logged-in user
      };

      setQualityChecks(prev => [...prev, newCheck]);

      if (newCheck.cleanliness === 'fail' || newCheck.foodSafety === 'fail') {
        toast({
          title: "Quality Check Failed",
          description: `Station ${station} requires immediate attention`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Quality Check Passed",
          description: `Station ${station} meets all standards`,
        });
      }
    } catch (error) {
      console.error('Error performing quality check:', error);
      toast({
        title: "Error",
        description: "Failed to perform quality check",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Quality Control</h3>
        </div>
        <Button onClick={() => performQualityCheck("All Stations")}>
          Perform Check
        </Button>
      </div>

      <div className="space-y-4">
        {qualityChecks.map((check) => (
          <div
            key={check.id}
            className="border rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{check.station}</h4>
              <Badge variant={
                check.cleanliness === 'pass' && check.foodSafety === 'pass' 
                  ? 'success' 
                  : 'destructive'
              }>
                {check.cleanliness === 'pass' && check.foodSafety === 'pass' 
                  ? 'Passed' 
                  : 'Failed'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Temperature</p>
                <p className="font-medium">{check.temperature}°F</p>
              </div>
              <div>
                <p className="text-muted-foreground">Checked By</p>
                <p className="font-medium">{check.checkedBy}</p>
              </div>
            </div>

            {(check.cleanliness === 'fail' || check.foodSafety === 'fail') && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 rounded">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">
                  Requires immediate attention
                </span>
              </div>
            )}

            {check.notes && (
              <p className="text-sm text-muted-foreground mt-2">
                Notes: {check.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
