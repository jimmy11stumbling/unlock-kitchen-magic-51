
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FileText } from "lucide-react";
import type { StaffMember } from "@/types/staff";

interface DocumentsCardProps {
  selectedStaff: StaffMember;
}

export const DocumentsCard = ({ selectedStaff }: DocumentsCardProps) => {
  const { toast } = useToast();
  
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold mb-4">Staff Documents</h3>
          <Button 
            variant="outline" 
            onClick={() => toast({ title: "Coming Soon", description: "Document upload feature is under development" })}
          >
            <FileText className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 border rounded-md">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              <span>Employment Contract</span>
            </div>
            <Button variant="ghost" size="sm">Download</Button>
          </div>
          
          <div className="flex justify-between items-center p-3 border rounded-md">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-500" />
              <span>Tax Information</span>
            </div>
            <Button variant="ghost" size="sm">Download</Button>
          </div>
          
          {selectedStaff.certifications && selectedStaff.certifications.map((cert, index) => (
            <div key={index} className="flex justify-between items-center p-3 border rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-500" />
                <span>{cert} Certificate</span>
              </div>
              <Button variant="ghost" size="sm">Download</Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
