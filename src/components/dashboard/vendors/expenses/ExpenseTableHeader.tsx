
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ExpenseTableHeaderProps {
  onAddExpense: () => void;
}

export const ExpenseTableHeader = ({ onAddExpense }: ExpenseTableHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">Expense Records</h3>
      <Button onClick={onAddExpense}>
        <Plus className="h-4 w-4 mr-2" />
        Add Expense
      </Button>
    </div>
  );
};
