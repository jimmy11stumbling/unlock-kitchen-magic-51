
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type SubscriptionTier = Database["public"]["Enums"]["subscription_tier"];

interface UserSubscription {
  id: string;
  email: string;
  tier: SubscriptionTier;
  active: boolean;
  startDate: string;
  endDate: string | null;
}

export const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      const { data: subs, error: subsError } = await supabase
        .from("subscriptions")
        .select("*");
      if (subsError) throw subsError;

      const subscriptionsWithUsers = authUsers.users.map(user => {
        const userSub = subs.find(sub => sub.user_id === user.id);
        return {
          id: user.id,
          email: user.email || "No email",
          tier: userSub?.tier || "free",
          active: userSub?.active || false,
          startDate: userSub?.start_date || new Date().toISOString(),
          endDate: userSub?.end_date || null
        };
      });

      setSubscriptions(subscriptionsWithUsers);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (userId: string, tier: SubscriptionTier) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .upsert({
          user_id: userId,
          tier,
          active: true,
          start_date: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });

      await fetchSubscriptions();
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Subscription Management</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Email</TableHead>
            <TableHead>Current Tier</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>{subscription.email}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {subscription.tier}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={subscription.active ? "success" : "destructive"}>
                  {subscription.active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(subscription.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Select
                    onValueChange={(value: SubscriptionTier) => 
                      updateSubscription(subscription.id, value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Change tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Billing
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
