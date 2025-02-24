
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import type { Expense } from "@/types/vendor";
import { vendorService } from "../services/vendorService";

interface ExpenseFormProps {
  expense?: Expense;
  vendorId: number;
  onClose: () => void;
  onSubmit: () => void;
}

export const ExpenseForm = ({ expense, vendorId, onClose, onSubmit }: ExpenseFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vendorId,
    amount: expense?.amount || 0,
    date: expense?.date || new Date().toISOString().split('T')[0],
    category: expense?.category || "",
    description: expense?.description || "",
    paymentMethod: expense?.paymentMethod || "",
    taxDeductible: expense?.taxDeductible || false,
    status: expense?.status || "pending"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await vendorService.addExpense(formData);
      toast({ title: "Expense added successfully" });
      onSubmit();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save expense",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
        required
        min="0"
        step="0.01"
      />
      <Input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />
      <Input
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      />
      <Textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <Input
        placeholder="Payment Method"
        value={formData.paymentMethod}
        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="taxDeductible"
          checked={formData.taxDeductible}
          onChange={(e) => setFormData({ ...formData, taxDeductible: e.target.checked })}
        />
        <label htmlFor="taxDeductible">Tax Deductible</label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Expense"}
        </Button>
      </div>
    </form>
  );
};
