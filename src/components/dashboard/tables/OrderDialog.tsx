
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (serverName: string) => void;
  tableId: number;
}

export function OrderDialog({ 
  open, 
  onOpenChange, 
  onSubmit,
  tableId 
}: OrderDialogProps) {
  const [serverName, setServerName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serverName.trim()) {
      setError("Server name is required");
      return;
    }
    
    onSubmit(serverName);
    setServerName("");
    setError("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Order for Table {tableId}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="server-name">Server Name</Label>
            <Input
              id="server-name"
              value={serverName}
              onChange={(e) => {
                setServerName(e.target.value);
                setError("");
              }}
              placeholder="Enter server name"
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setServerName("");
                setError("");
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Create Order</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
