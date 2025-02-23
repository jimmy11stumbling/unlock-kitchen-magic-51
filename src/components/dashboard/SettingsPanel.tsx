
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Users, Calendar } from "lucide-react";

export const SettingsPanel = () => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Restaurant Information</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              General Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Staff Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Settings
            </Button>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2">System</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-red-600">
              Clear All Data
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
