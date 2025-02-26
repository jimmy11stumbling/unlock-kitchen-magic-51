
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Bell, Info, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Announcement {
  id: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  active: boolean;
}

type AnnouncementInsert = Pick<Announcement, 'content' | 'priority' | 'active'>;

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [priority, setPriority] = useState<Announcement["priority"]>("normal");
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
    fetchAnnouncements();
    subscribeToAnnouncements();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    setIsAdmin(roles?.role === 'admin');
  };

  const subscribeToAnnouncements = () => {
    const channel = supabase
      .channel('announcements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements'
        },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("id, content, priority, created_at, updated_at, active")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .returns<Announcement[]>();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive",
      });
      return;
    }

    setAnnouncements(data || []);
  };

  const createAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;

    const newAnnouncementData: AnnouncementInsert = {
      content: newAnnouncement.trim(),
      priority,
      active: true
    };

    const { error } = await supabase
      .from("announcements")
      .insert([newAnnouncementData]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      });
      return;
    }

    setNewAnnouncement("");
    setPriority("normal");
    toast({
      title: "Success",
      description: "Announcement created successfully",
    });
  };

  const deactivateAnnouncement = async (id: string) => {
    const { error } = await supabase
      .from("announcements")
      .update({ active: false })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove announcement",
        variant: "destructive",
      });
    }
  };

  const getPriorityIcon = (priority: Announcement["priority"]) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "high":
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case "normal":
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Announcement["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Announcements</h2>
        {isAdmin && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">New Announcement</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                  placeholder="Enter announcement text..."
                  className="min-h-[100px]"
                />
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as Announcement["priority"])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={createAnnouncement}>Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No active announcements</p>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`p-4 rounded-lg border ${getPriorityColor(announcement.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getPriorityIcon(announcement.priority)}
                  <div>
                    <p className="font-medium">{announcement.content}</p>
                    <p className="text-sm opacity-75">
                      {new Date(announcement.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deactivateAnnouncement(announcement.id)}
                  >
                    Dismiss
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
