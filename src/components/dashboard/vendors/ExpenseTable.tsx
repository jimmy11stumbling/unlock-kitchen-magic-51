
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import type { Expense } from "@/types/vendor";
import { vendorService } from "./services/vendorService";
import { ExpenseForm } from "./forms/ExpenseForm";
import { ExpenseTableHeader } from "./expenses/ExpenseTableHeader";
import { ExpenseList } from "./expenses/ExpenseList";
import { DeleteExpenseDialog } from "./expenses/DeleteExpenseDialog";

interface ExpenseTableProps {
  expenses: Expense[];
  searchTerm: string;
  onUpdate?: () => void;
}

export const ExpenseTable = ({ expenses, searchTerm, onUpdate }: ExpenseTableProps) => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredExpenses = expenses.filter((expense) =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setShowAddExpense(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowAddExpense(true);
  };

  const handleDeleteExpense = async () => {
    if (!confirmDelete) return;
    
    try {
      await vendorService.deleteExpense(confirmDelete.toString());
      toast({
        title: "Expense deleted",
        description: "Expense has been removed successfully"
      });
      if (onUpdate) onUpdate();
      setConfirmDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive"
      });
    }
  };

  const handleFormSuccess = () => {
    setShowAddExpense(false);
    if (onUpdate) onUpdate();
  };

  return (
    <div className="space-y-4">
      <ExpenseTableHeader onAddExpense={handleAddExpense} />

      <ExpenseList 
        expenses={filteredExpenses} 
        onEdit={handleEditExpense} 
        onDelete={(id) => setConfirmDelete(id)} 
      />

      {/* Add/Edit Expense Dialog */}
      <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedExpense ? "Edit Expense" : "Add Expense"}</DialogTitle>
          </DialogHeader>
          <ExpenseForm 
            expense={selectedExpense}
            onClose={() => setShowAddExpense(false)}
            onSuccess={handleFormSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <DeleteExpenseDialog 
        isOpen={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDeleteExpense}
      />
    </div>
  );
};
