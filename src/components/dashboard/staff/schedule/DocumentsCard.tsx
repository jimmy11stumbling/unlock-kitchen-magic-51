import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileIcon, DownloadIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StaffMember } from "@/types/staff";

export interface DocumentsCardProps {
  staffMember: StaffMember | null;
}

export const DocumentsCard = ({ staffMember }: DocumentsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {staffMember ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4 text-muted-foreground" />
                <span>Contract.pdf</span>
              </div>
              <Button variant="ghost" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4 text-muted-foreground" />
                <span>NDA.pdf</span>
              </div>
              <Button variant="ghost" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <Button variant="outline" className="w-full justify-center">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">Select a staff member to view documents.</p>
        )}
      </CardContent>
    </Card>
  );
};
