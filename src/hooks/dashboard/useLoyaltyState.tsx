
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface LoyaltyMember {
  id: number;
  name: string;
  email: string;
  points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  joinDate: string;
  lastVisit: string;
}

export const useLoyaltyState = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<LoyaltyMember[]>([]);

  const calculateTier = (points: number): LoyaltyMember["tier"] => {
    if (points >= 1000) return "Platinum";
    if (points >= 500) return "Gold";
    if (points >= 200) return "Silver";
    return "Bronze";
  };

  const addMember = (memberData: Omit<LoyaltyMember, "id" | "tier" | "points">) => {
    const newMember: LoyaltyMember = {
      id: members.length + 1,
      points: 0,
      tier: "Bronze",
      ...memberData,
    };
    setMembers([...members, newMember]);
    toast({
      title: "Member added",
      description: `${memberData.name} has been added to the loyalty program.`,
    });
  };

  const addPoints = (memberId: number, points: number) => {
    setMembers(members.map(member => {
      if (member.id === memberId) {
        const newPoints = member.points + points;
        const newTier = calculateTier(newPoints);
        
        if (newTier !== member.tier) {
          toast({
            title: "Tier upgrade!",
            description: `Congratulations! ${member.name} has reached ${newTier} tier!`,
          });
        }
        
        return {
          ...member,
          points: newPoints,
          tier: newTier,
          lastVisit: new Date().toISOString(),
        };
      }
      return member;
    }));
  };

  return {
    members,
    addMember,
    addPoints,
  };
};
