
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Crown, Gift, Star, Users, CreditCard } from "lucide-react";
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

interface LoyaltyPanelProps {
  members: LoyaltyMember[];
  onAddMember: (member: Omit<LoyaltyMember, "id" | "tier" | "points">) => void;
  onAddPoints: (memberId: number, points: number) => void;
}

export const LoyaltyPanel = ({ members, onAddMember, onAddPoints }: LoyaltyPanelProps) => {
  const { toast } = useToast();
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    joinDate: new Date().toISOString().split('T')[0],
    lastVisit: new Date().toISOString().split('T')[0],
  });

  const getTierColor = (tier: LoyaltyMember["tier"]) => {
    switch (tier) {
      case "Bronze": return "text-orange-600";
      case "Silver": return "text-gray-400";
      case "Gold": return "text-yellow-500";
      case "Platinum": return "text-blue-500";
      default: return "text-gray-600";
    }
  };

  const calculateTier = (points: number): LoyaltyMember["tier"] => {
    if (points >= 1000) return "Platinum";
    if (points >= 500) return "Gold";
    if (points >= 200) return "Silver";
    return "Bronze";
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Loyalty Program</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Users className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Loyalty Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Customer name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="customer@email.com"
                />
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  onAddMember(newMember);
                  setNewMember({
                    name: "",
                    email: "",
                    joinDate: new Date().toISOString().split('T')[0],
                    lastVisit: new Date().toISOString().split('T')[0],
                  });
                }}
              >
                Add Member
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-2xl font-bold">{members.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Crown className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-muted-foreground">Gold+ Members</p>
              <p className="text-2xl font-bold">
                {members.filter(m => ["Gold", "Platinum"].includes(m.tier)).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Gift className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-2xl font-bold">
                {members.reduce((sum, m) => sum + m.points, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Points/Member</p>
              <p className="text-2xl font-bold">
                {members.length > 0
                  ? Math.round(
                      members.reduce((sum, m) => sum + m.points, 0) / members.length
                    ).toLocaleString()
                  : 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Points</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Last Visit</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.points.toLocaleString()}</TableCell>
              <TableCell>
                <span className={`flex items-center ${getTierColor(member.tier)}`}>
                  <Star className="w-4 h-4 mr-1" fill="currentColor" />
                  {member.tier}
                </span>
              </TableCell>
              <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(member.lastVisit).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const points = 100;
                    onAddPoints(member.id, points);
                    toast({
                      title: "Points added",
                      description: `${points} points added to ${member.name}'s account.`,
                    });
                  }}
                >
                  Add Points
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
