
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Calendar, Tags, Percent, Clock } from "lucide-react";
import type { Promotion } from "@/types/staff";

interface PromotionsPanelProps {
  promotions: Promotion[];
  onAddPromotion: (promotion: Omit<Promotion, "id">) => void;
  onTogglePromotion: (id: number) => void;
}

export const PromotionsPanel = ({
  promotions,
  onAddPromotion,
  onTogglePromotion,
}: PromotionsPanelProps) => {
  const [newPromotion, setNewPromotion] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    discountType: "percentage" as const,
    discountValue: 0,
    applicableItems: [] as number[],
    active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPromotion(newPromotion);
    setNewPromotion({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      discountType: "percentage",
      discountValue: 0,
      applicableItems: [],
      active: true,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Create New Promotion</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newPromotion.name}
                onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                placeholder="Promotion name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Discount Value</label>
              <Input
                type="number"
                value={newPromotion.discountValue}
                onChange={(e) => setNewPromotion({ ...newPromotion, discountValue: Number(e.target.value) })}
                placeholder="Discount amount"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={newPromotion.startDate}
                onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={newPromotion.endDate}
                onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input
              value={newPromotion.description}
              onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
              placeholder="Promotion description"
            />
          </div>
          <Button type="submit">Create Promotion</Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Promotions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promo) => (
              <TableRow key={promo.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Tags className="w-4 h-4 mr-2" />
                    <span>{promo.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Percent className="w-4 h-4 mr-2" />
                    <span>{promo.discountValue}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${promo.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {promo.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTogglePromotion(promo.id)}
                  >
                    {promo.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
