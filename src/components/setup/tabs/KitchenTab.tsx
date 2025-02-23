
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import type { KitchenSetupInfo } from "../types";

interface KitchenTabProps {
  kitchenInfo: KitchenSetupInfo;
  setKitchenInfo: (info: KitchenSetupInfo) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const KitchenTab = ({ kitchenInfo, setKitchenInfo, onValidationChange }: KitchenTabProps) => {
  const [newStation, setNewStation] = useState("");
  const [newPrinter, setNewPrinter] = useState("");

  const addStation = () => {
    if (newStation && !kitchenInfo.stations.includes(newStation)) {
      setKitchenInfo({
        ...kitchenInfo,
        stations: [...kitchenInfo.stations, newStation]
      });
      setNewStation("");
    }
  };

  const addPrinter = () => {
    if (newPrinter && !kitchenInfo.printerLocations.includes(newPrinter)) {
      setKitchenInfo({
        ...kitchenInfo,
        printerLocations: [...kitchenInfo.printerLocations, newPrinter]
      });
      setNewPrinter("");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Kitchen Stations</h3>
          <div className="flex gap-2 mb-4">
            <Input
              value={newStation}
              onChange={(e) => setNewStation(e.target.value)}
              placeholder="Add new station"
            />
            <Button onClick={addStation}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {kitchenInfo.stations.map((station) => (
              <Badge key={station} variant="secondary">
                {station}
                <button
                  onClick={() => setKitchenInfo({
                    ...kitchenInfo,
                    stations: kitchenInfo.stations.filter(s => s !== station)
                  })}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Printer Locations</h3>
          <div className="flex gap-2 mb-4">
            <Input
              value={newPrinter}
              onChange={(e) => setNewPrinter(e.target.value)}
              placeholder="Add printer location"
            />
            <Button onClick={addPrinter}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {kitchenInfo.printerLocations.map((printer) => (
              <Badge key={printer} variant="secondary">
                {printer}
                <button
                  onClick={() => setKitchenInfo({
                    ...kitchenInfo,
                    printerLocations: kitchenInfo.printerLocations.filter(p => p !== printer)
                  })}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Preparation Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Alerts</label>
              <Switch
                checked={kitchenInfo.preparationAlerts.enabled}
                onCheckedChange={(checked) => setKitchenInfo({
                  ...kitchenInfo,
                  preparationAlerts: {
                    ...kitchenInfo.preparationAlerts,
                    enabled: checked
                  }
                })}
              />
            </div>
            {kitchenInfo.preparationAlerts.enabled && (
              <div>
                <label className="text-sm font-medium">Alert Threshold (minutes)</label>
                <Input
                  type="number"
                  value={kitchenInfo.preparationAlerts.timeThreshold}
                  onChange={(e) => setKitchenInfo({
                    ...kitchenInfo,
                    preparationAlerts: {
                      ...kitchenInfo.preparationAlerts,
                      timeThreshold: Number(e.target.value)
                    }
                  })}
                  min="1"
                />
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Display Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Group by Category</label>
              <Switch
                checked={kitchenInfo.displayPreferences.groupByCategory}
                onCheckedChange={(checked) => setKitchenInfo({
                  ...kitchenInfo,
                  displayPreferences: {
                    ...kitchenInfo.displayPreferences,
                    groupByCategory: checked
                  }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Timers</label>
              <Switch
                checked={kitchenInfo.displayPreferences.showTimers}
                onCheckedChange={(checked) => setKitchenInfo({
                  ...kitchenInfo,
                  displayPreferences: {
                    ...kitchenInfo.displayPreferences,
                    showTimers: checked
                  }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Notes</label>
              <Switch
                checked={kitchenInfo.displayPreferences.showNotes}
                onCheckedChange={(checked) => setKitchenInfo({
                  ...kitchenInfo,
                  displayPreferences: {
                    ...kitchenInfo.displayPreferences,
                    showNotes: checked
                  }
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
