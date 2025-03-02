
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import type { Expense } from "@/types/vendor";
import { vendorService } from "../services/vendorService";

interface ExpenseFormProps {
  expense?: Expense | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ExpenseForm = ({ expense, onClose, onSuccess }: ExpenseFormProps) => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<{ id: number; name: string }[]>([]);
  const [date, setDate] = useState<Date | undefined>(
    expense ? new Date(expense.date) : new Date()
  );
  
  const [formData, setFormData] = useState<Omit<Expense, "id" | "createdAt" | "updatedAt">>({
    vendorId: expense?.vendorId || 0,
    amount: expense?.amount || 0,
    date: expense?.date || new Date().toISOString(),
    category: expense?.category || "supplies",
    description: expense?.description || "",
    paymentMethod: expense?.paymentMethod || "bank_transfer",
    receiptUrl: expense?.receiptUrl || "",
    taxDeductible: expense?.taxDeductible || false,
    status: expense?.status || "pending"
  });

  // Fetch vendors for dropdown
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const fetchedVendors = await vendorService.getVendors();
        setVendors(fetchedVendors.map(v => ({ id: v.id, name: v.name })));
      } catch (error) {
        console.error("Failed to load vendors:", error);
      }
    };
    
    loadVendors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setFormData(prev => ({ ...prev, date: date.toISOString() }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (expense) {
        await vendorService.updateExpense(expense.id.toString(), formData);
        toast({
          title: "Expense updated",
          description: "Expense record has been updated successfully"
        });
      } else {
        await vendorService.addExpense(formData);
        toast({
          title: "Expense added",
          description: "New expense record has been added successfully"
        });
      }
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: expense ? "Failed to update expense" : "Failed to add expense",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vendorId">Vendor</Label>
        <Select
          value={formData.vendorId.toString()}
          onValueChange={(value) => handleSelectChange("vendorId", value)}
        >
          <SelectTrigger id="vendorId">
            <SelectValue placeholder="Select vendor" />
          </SelectTrigger>
          <SelectContent>
            {vendors.map((vendor) => (
              <SelectItem key={vendor.id} value={vendor.id.toString()}>
                {vendor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleNumberChange}
            placeholder="Enter amount"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleSelectChange("category", value)}
            required
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="supplies">Supplies</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="rent">Rent</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="payroll">Payroll</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method *</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) => handleSelectChange("paymentMethod", value)}
            required
          >
            <SelectTrigger id="paymentMethod">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Credit Card</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="check">Check</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="void">Void</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter expense description"
          className="min-h-[80px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="receiptUrl">Receipt URL</Label>
        <Input
          id="receiptUrl"
          name="receiptUrl"
          value={formData.receiptUrl || ''}
          onChange={handleChange}
          placeholder="URL to receipt image/document"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="taxDeductible" 
          checked={formData.taxDeductible}
          onCheckedChange={(checked) => 
            handleCheckboxChange("taxDeductible", checked as boolean)
          }
        />
        <Label htmlFor="taxDeductible" className="cursor-pointer">
          Tax Deductible
        </Label>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {expense ? "Update Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
};
