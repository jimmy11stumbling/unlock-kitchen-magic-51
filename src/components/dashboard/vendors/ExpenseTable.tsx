
import { Card } from "@/components/ui/card";
import type { Expense } from "@/types/vendor";

interface ExpenseTableProps {
  expenses: Expense[];
  searchTerm: string;
}

export const ExpenseTable = ({ expenses, searchTerm }: ExpenseTableProps) => {
  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-md border">
      {filteredExpenses.length === 0 ? (
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            {searchTerm ? "No expenses match your search." : "No expenses recorded. Add expenses to track your vendor payments."}
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {filteredExpenses.map((expense) => (
            <div key={expense.id} className="p-4 hover:bg-muted/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{expense.description}</h3>
                  <p className="text-sm text-muted-foreground">{expense.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${expense.amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{expense.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
