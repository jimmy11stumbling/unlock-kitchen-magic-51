
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface DateRangeSelectorProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onRangeChange: (start: Date | undefined, end: Date | undefined) => void;
}

export const DateRangeSelector = ({
  startDate,
  endDate,
  onRangeChange,
}: DateRangeSelectorProps) => {
  const { toast } = useToast();
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  // Validate date range whenever either date changes
  useEffect(() => {
    if (startDate && endDate) {
      const normalizedStartDate = startOfDay(startDate);
      const normalizedEndDate = startOfDay(endDate);

      if (isAfter(normalizedStartDate, normalizedEndDate)) {
        toast({
          title: "Invalid Date Range",
          description: "Start date cannot be after end date",
          variant: "destructive",
        });
        onRangeChange(undefined, undefined);
      }
    }
  }, [startDate, endDate, onRangeChange, toast]);

  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) {
      onRangeChange(undefined, endDate);
    } else {
      const normalizedDate = startOfDay(date);
      if (endDate && isAfter(normalizedDate, endDate)) {
        // If selected start date is after current end date, clear end date
        onRangeChange(normalizedDate, undefined);
        toast({
          description: "End date cleared as it was before new start date",
        });
      } else {
        onRangeChange(normalizedDate, endDate);
      }
    }
    setIsStartDateOpen(false);
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date) {
      onRangeChange(startDate, undefined);
    } else {
      const normalizedDate = startOfDay(date);
      if (startDate && isBefore(normalizedDate, startDate)) {
        // If selected end date is before current start date, clear start date
        onRangeChange(undefined, normalizedDate);
        toast({
          description: "Start date cleared as it was after new end date",
        });
      } else {
        onRangeChange(startDate, normalizedDate);
      }
    }
    setIsEndDateOpen(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={`w-[200px] justify-start text-left font-normal ${!startDate ? 'text-muted-foreground' : ''}`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "PPP") : "Pick start date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={handleStartDateSelect}
            disabled={(date) => endDate ? isAfter(date, endDate) : false}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={`w-[200px] justify-start text-left font-normal ${!endDate ? 'text-muted-foreground' : ''}`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "PPP") : "Pick end date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={handleEndDateSelect}
            disabled={(date) => startDate ? isBefore(date, startDate) : false}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
