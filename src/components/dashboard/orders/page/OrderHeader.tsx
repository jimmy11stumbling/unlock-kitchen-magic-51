
import { ChevronDown, PlusCircle, BarChart, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface OrderHeaderProps {
  setActiveTab: (tab: string) => void;
}

export function OrderHeader({ setActiveTab }: OrderHeaderProps) {
  const { toast } = useToast();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <img 
          src="/placeholder.svg" 
          alt="Logo" 
          className="h-10 w-10"
        />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          OrderFlow Pro
        </h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            Quick Actions
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setActiveTab("new")}>
            <PlusCircle className="w-4 h-4 mr-2" />
            New Order
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast({ 
            title: "Generating report...",
            description: "Your report will be ready in a few moments."
          })}>
            <BarChart className="w-4 h-4 mr-2" />
            Generate Report
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setActiveTab("history")}>
            <History className="w-4 h-4 mr-2" />
            View History
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
