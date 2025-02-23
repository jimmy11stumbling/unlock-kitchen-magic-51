
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAvailableStates } from "@/utils/taxCalculator";
import { RestaurantInfo } from "../types";

interface BasicInfoTabProps {
  restaurantInfo: RestaurantInfo;
  setRestaurantInfo: (info: RestaurantInfo) => void;
}

export const BasicInfoTab = ({ restaurantInfo, setRestaurantInfo }: BasicInfoTabProps) => {
  const states = getAvailableStates();
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Restaurant Name</label>
          <Input
            value={restaurantInfo.name}
            onChange={(e) => setRestaurantInfo({ ...restaurantInfo, name: e.target.value })}
            placeholder="Enter restaurant name"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Address</label>
          <Textarea
            value={restaurantInfo.address}
            onChange={(e) => setRestaurantInfo({ ...restaurantInfo, address: e.target.value })}
            placeholder="Enter full address"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={restaurantInfo.phone}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input
              value={restaurantInfo.email}
              onChange={(e) => setRestaurantInfo({ ...restaurantInfo, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">State</label>
          <Select
            value={restaurantInfo.state}
            onValueChange={(value) => setRestaurantInfo({ ...restaurantInfo, state: value })}
          >
            <SelectTrigger>
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
                  onChange={(e) => setRestaurantInfo({
                    ...restaurantInfo,
                    businessHours: {
                      ...restaurantInfo.businessHours,
                      [day]: { ...restaurantInfo.businessHours[day], open: e.target.value }
                    }
                  })}
                />
                <Input
                  type="time"
                  value={restaurantInfo.businessHours[day].close}
                  onChange={(e) => setRestaurantInfo({
                    ...restaurantInfo,
                    businessHours: {
                      ...restaurantInfo.businessHours,
                      [day]: { ...restaurantInfo.businessHours[day], close: e.target.value }
                    }
                  })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
