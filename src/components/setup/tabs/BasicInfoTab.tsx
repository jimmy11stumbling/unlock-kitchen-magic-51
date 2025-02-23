
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvailableStates } from "@/utils/taxCalculator";
import { RestaurantInfo } from "../types";
import { restaurantInfoSchema } from "../validation/schemas";
import { useToast } from "@/hooks/use-toast";

interface BasicInfoTabProps {
  restaurantInfo: RestaurantInfo;
  setRestaurantInfo: (info: RestaurantInfo) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const BasicInfoTab = ({ 
  restaurantInfo, 
  setRestaurantInfo, 
  onValidationChange 
}: BasicInfoTabProps) => {
  const { toast } = useToast();
  const states = getAvailableStates();
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: keyof RestaurantInfo, value: any) => {
    try {
      const schema = restaurantInfoSchema.pick({ [field]: true });
      schema.parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: "" }));
      return true;
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || `Invalid ${field}`;
      setErrors(prev => ({ ...prev, [field]: errorMessage }));
      return false;
    }
  };

  const handleChange = (field: keyof RestaurantInfo, value: any) => {
    const newInfo = { ...restaurantInfo, [field]: value };
    setRestaurantInfo(newInfo);
    validateField(field, value);
  };

  useEffect(() => {
    const validate = () => {
      try {
        restaurantInfoSchema.parse(restaurantInfo);
        onValidationChange?.(true);
        return true;
      } catch (error: any) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
        onValidationChange?.(false);
        return false;
      }
    };
    validate();
  }, [restaurantInfo, onValidationChange]);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Restaurant Name</label>
          <Input
            value={restaurantInfo.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter restaurant name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Address</label>
          <Textarea
            value={restaurantInfo.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Enter full address"
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={restaurantInfo.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Enter phone number"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              value={restaurantInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email address"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">State</label>
          <Select
            value={restaurantInfo.state}
            onValueChange={(value) => handleChange("state", value)}
          >
            <SelectTrigger className={errors.state ? "border-red-500" : ""}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Business Hours</label>
          <div className="space-y-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="grid grid-cols-3 gap-2 items-center">
                <span className="capitalize">{day}</span>
                <Input
                  type="time"
                  value={restaurantInfo.businessHours[day].open}
                  onChange={(e) => {
                    const newHours = {
                      ...restaurantInfo.businessHours,
                      [day]: { ...restaurantInfo.businessHours[day], open: e.target.value }
                    };
                    handleChange("businessHours", newHours);
                  }}
                  className={errors[`businessHours.${day}.open`] ? "border-red-500" : ""}
                />
                <Input
                  type="time"
                  value={restaurantInfo.businessHours[day].close}
                  onChange={(e) => {
                    const newHours = {
                      ...restaurantInfo.businessHours,
                      [day]: { ...restaurantInfo.businessHours[day], close: e.target.value }
                    };
                    handleChange("businessHours", newHours);
                  }}
                  className={errors[`businessHours.${day}.close`] ? "border-red-500" : ""}
                />
              </div>
            ))}
          </div>
          {Object.entries(errors)
            .filter(([key]) => key.startsWith("businessHours"))
            .map(([key, value]) => (
              <p key={key} className="text-sm text-red-500 mt-1">{value}</p>
            ))}
        </div>
      </div>
    </Card>
  );
};
