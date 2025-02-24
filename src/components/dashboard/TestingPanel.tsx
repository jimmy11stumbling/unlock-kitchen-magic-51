
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStressTest } from "@/hooks/useStressTest";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export const TestingPanel = () => {
  const { isRunning, startTest } = useStressTest();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const handleStartTest = async () => {
    setTestResults([]);
    setProgress(0);
    
    // Create a custom console.log to capture output
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      originalLog(...args);
      setTestResults(prev => [...prev, args.join(" ")]);
      setProgress(prev => Math.min(prev + 14, 100)); // Increment progress for each log
    };
    
    console.error = (...args) => {
      originalError(...args);
      setTestResults(prev => [...prev, "❌ Error: " + args.join(" ")]);
      setProgress(prev => Math.min(prev + 14, 100));
    };

    await startTest();
    
    // Restore original console functions
    console.log = originalLog;
    console.error = originalError;
    setProgress(100);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">System Testing</h2>
            <p className="text-muted-foreground">
              Run comprehensive tests to verify system stability and performance.
            </p>
          </div>
          <Button 
            onClick={handleStartTest} 
            disabled={isRunning}
            className="min-w-[150px]"
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

        {progress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {testResults.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Test Results</h3>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div 
                      key={index}
                      className={`font-mono text-sm ${
                        result.includes("❌") 
                          ? "text-red-500" 
                          : result.includes("✅") 
                          ? "text-green-500" 
                          : "text-muted-foreground"
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
