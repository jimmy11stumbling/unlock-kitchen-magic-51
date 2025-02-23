
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(1, "Please select a role"),
  salary: z.string().min(1, "Please enter a salary"),
});

export type StaffFormValues = z.infer<typeof formSchema>;

interface AddStaffFormProps {
  onSubmit: (data: StaffFormValues) => void;
}

export const AddStaffForm = ({ onSubmit }: AddStaffFormProps) => {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      salary: "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter staff name" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="chef">Chef</SelectItem>
                <SelectItem value="server">Server</SelectItem>
                <SelectItem value="bartender">Bartender</SelectItem>
                <SelectItem value="host">Host</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="salary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salary</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter salary" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full">Add Staff Member</Button>
    </form>
  );
};
