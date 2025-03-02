
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Expense } from "@/types/vendor";
import { Calendar, DollarSign, Edit, Tag, Trash2 } from "lucide-react";

interface ExpenseTableRowProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

export const ExpenseTableRow = ({ expense, onEdit, onDelete }: ExpenseTableRowProps) => {
  return (
    <TableRow key={expense.id}>
      <TableCell>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {new Date(expense.date).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>{expense.vendorName || `Vendor #${expense.vendorId}`}</TableCell>
      <TableCell>
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
          {expense.category}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
          ${expense.amount.toFixed(2)}
        </div>
      </TableCell>
      <TableCell className="capitalize">{expense.paymentMethod.replace('_', ' ')}</TableCell>
      <TableCell>
        <Badge
          variant={
            expense.status === "paid" ? "default" :
            expense.status === "pending" ? "secondary" :
            "outline"
          }
        >
          {expense.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(expense)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(expense.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
