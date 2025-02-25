
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Card } from "@/components/ui/card";

interface AlertSectionProps {
  alerts: string[];
}

export const AlertSection = ({ alerts }: AlertSectionProps) => {
  return (
    <Card className="col-span-full p-6">
      <h2 className="text-xl font-semibold mb-4">Kitchen Alerts</h2>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <Alert variant="destructive" key={index}>
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Stock Alert</AlertTitle>
            <AlertDescription>{alert}</AlertDescription>
          </Alert>
        ))}
      </div>
    </Card>
  );
};
