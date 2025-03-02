
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";

interface CertificationsCardProps {
  selectedStaff: StaffMember;
  onAddCertification: () => void;
  onUpdatePerformance: () => void;
}

export const CertificationsCard = ({ 
  selectedStaff, 
  onAddCertification,
  onUpdatePerformance
}: CertificationsCardProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Qualifications & Certifications</h3>
          <Button variant="outline" onClick={onAddCertification}>
            Add Certification
          </Button>
        </div>
        
        <div className="space-y-2">
          {selectedStaff.certifications && selectedStaff.certifications.length > 0 ? (
            selectedStaff.certifications.map((cert, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                  <span>{cert}</span>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No certifications added yet.</p>
          )}
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Performance Rating</h3>
            <Button size="sm" onClick={onUpdatePerformance}>Update</Button>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-primary h-4 rounded-full" 
              style={{ width: `${(selectedStaff.performanceRating / 5) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-sm">
            <span>0</span>
            <span className="font-medium">{selectedStaff.performanceRating}/5</span>
            <span>5</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
