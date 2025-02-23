
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import type { PaymentSetupInfo } from "../types";

interface PaymentTabProps {
  paymentInfo: PaymentSetupInfo;
  setPaymentInfo: (info: PaymentSetupInfo) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const PaymentTab = ({ paymentInfo, setPaymentInfo, onValidationChange }: PaymentTabProps) => {
  const [newGratuity, setNewGratuity] = useState("");

  const addGratuityOption = () => {
    const value = Number(newGratuity);
    if (value && !paymentInfo.gratuityOptions.includes(value)) {
      setPaymentInfo({
        ...paymentInfo,
        gratuityOptions: [...paymentInfo.gratuityOptions, value].sort((a, b) => a - b)
      });
      setNewGratuity("");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
          <div className="space-y-4">
            {paymentInfo.methods.map((method, index) => (
              <div key={method.type} className="flex items-center justify-between">
                <label className="text-sm font-medium capitalize">{method.type}</label>
                <Switch
                  checked={method.enabled}
                  onCheckedChange={(checked) => {
                    const newMethods = [...paymentInfo.methods];
                    newMethods[index] = { ...method, enabled: checked };
                    setPaymentInfo({ ...paymentInfo, methods: newMethods });
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Tax Rate</h3>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={paymentInfo.taxRate}
              onChange={(e) => setPaymentInfo({
                ...paymentInfo,
                taxRate: Number(e.target.value)
              })}
              min="0"
              max="100"
              step="0.1"
            />
            <span>%</span>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Gratuity Options</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="number"
                value={newGratuity}
                onChange={(e) => setNewGratuity(e.target.value)}
                placeholder="Add gratuity percentage"
                min="0"
                max="100"
              />
              <Button onClick={addGratuityOption}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {paymentInfo.gratuityOptions.map((option) => (
                <Badge key={option} variant="secondary">
                  {option}%
                  <button
                    onClick={() => setPaymentInfo({
                      ...paymentInfo,
                      gratuityOptions: paymentInfo.gratuityOptions.filter(o => o !== option)
                    })}
                    className="ml-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Auto Gratuity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Auto Gratuity</label>
              <Switch
                checked={paymentInfo.autoGratuity.enabled}
                onCheckedChange={(checked) => setPaymentInfo({
                  ...paymentInfo,
                  autoGratuity: { ...paymentInfo.autoGratuity, enabled: checked }
                })}
              />
            </div>
            {paymentInfo.autoGratuity.enabled && (
              <>
                <div>
                  <label className="text-sm font-medium">Minimum Party Size</label>
                  <Input
                    type="number"
                    value={paymentInfo.autoGratuity.partySize}
                    onChange={(e) => setPaymentInfo({
                      ...paymentInfo,
                      autoGratuity: {
                        ...paymentInfo.autoGratuity,
                        partySize: Number(e.target.value)
                      }
                    })}
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Auto Gratuity Percentage</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={paymentInfo.autoGratuity.percentage}
                      onChange={(e) => setPaymentInfo({
                        ...paymentInfo,
                        autoGratuity: {
                          ...paymentInfo.autoGratuity,
                          percentage: Number(e.target.value)
                        }
                      })}
                      min="0"
                      max="100"
                    />
                    <span>%</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
