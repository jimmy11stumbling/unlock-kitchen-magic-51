import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusIcon, Calendar, Star } from "lucide-react";
import type { StaffMember } from "@/types/staff";

export interface CertificationsCardProps {
  staffMember: StaffMember | null;
}

export function CertificationsCard({ staffMember }: CertificationsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Certifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {staffMember && staffMember.certifications && staffMember.certifications.length > 0 ? (
          <div className="space-y-2">
            {staffMember.certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{cert}</span>
                </div>
                <Badge variant="secondary">Valid</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No certifications added.</p>
        )}
        <Button variant="outline" className="w-full justify-start gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Certification
        </Button>
      </CardContent>
    </Card>
  );
}
