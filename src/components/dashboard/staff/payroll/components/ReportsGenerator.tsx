
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { StaffMember } from '@/types/staff';
import { CalendarIcon, Download, FileText, Mail, Printer } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface ReportsGeneratorProps {
  staff?: StaffMember[];
}

const ReportsGenerator: React.FC<ReportsGeneratorProps> = ({ staff = [] }) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedReport, setSelectedReport] = useState<string>("payroll");
  const [includeTaxes, setIncludeTaxes] = useState<boolean>(true);
  const [includeDeductions, setIncludeDeductions] = useState<boolean>(true);
  const [selectedFormat, setSelectedFormat] = useState<string>("pdf");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      alert("Please select date range");
      return;
    }
    
    setIsGenerating(true);
    // Mock API call
    setTimeout(() => {
      setIsGenerating(false);
      alert(`${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} report generated successfully!`);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Generator</CardTitle>
        <CardDescription>Create custom payroll and tax reports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Report Type</Label>
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="payroll">Payroll Summary</SelectItem>
              <SelectItem value="taxes">Tax Withholdings</SelectItem>
              <SelectItem value="401k">401k Contributions</SelectItem>
              <SelectItem value="timesheet">Employee Timesheets</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Include Information</Label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="taxes" checked={includeTaxes} onCheckedChange={(checked) => setIncludeTaxes(!!checked)} />
              <label htmlFor="taxes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Taxes and Withholdings
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="deductions" checked={includeDeductions} onCheckedChange={(checked) => setIncludeDeductions(!!checked)} />
              <label htmlFor="deductions" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Additional Deductions
              </label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Output Format</Label>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="csv">CSV Spreadsheet</SelectItem>
              <SelectItem value="excel">Excel Spreadsheet</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col gap-2">
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            <FileText className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Report"}
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" disabled={isGenerating}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="flex-1" disabled={isGenerating}>
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" className="flex-1" disabled={isGenerating}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsGenerator;
