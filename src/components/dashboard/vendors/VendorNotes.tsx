
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { vendorService } from "./services/vendorService";
import { Plus, Calendar, Edit, Save } from "lucide-react";
import type { Vendor } from "@/types/vendor";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

interface VendorNotesProps {
  vendor: Vendor;
  onUpdate: () => void;
}

export const VendorNotes = ({ vendor, onUpdate }: VendorNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const { toast } = useToast();

  // Fetch notes when the component loads
  useState(() => {
    const fetchNotes = async () => {
      try {
        const vendorNotes = await vendorService.getVendorNotes(vendor.id);
        setNotes(vendorNotes);
      } catch (error) {
        console.error("Failed to fetch vendor notes:", error);
      }
    };
    
    fetchNotes();
  });

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      const addedNote = await vendorService.addVendorNote(vendor.id, newNote);
      setNotes([...notes, addedNote]);
      setNewNote("");
      toast({
        title: "Note added",
        description: "Your note has been added successfully"
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add note",
        variant: "destructive"
      });
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = async () => {
    if (!editingNote || !editContent.trim()) return;
    
    try {
      await vendorService.updateVendorNote(editingNote, editContent);
      setNotes(notes.map(note => 
        note.id === editingNote 
          ? { ...note, content: editContent } 
          : note
      ));
      setEditingNote(null);
      setEditContent("");
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully"
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notes</h3>
      </div>
      
      <div className="space-y-6">
        {notes.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No notes have been added yet.</p>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="overflow-hidden">
              <CardContent className="p-4">
                {editingNote === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingNote(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(note.createdAt).toLocaleString()}
                        {note.createdBy && (
                          <span className="ml-2">by {note.createdBy}</span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNote(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="whitespace-pre-wrap">{note.content}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
        
        {/* Add new note */}
        <div className="space-y-2">
          <Textarea
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            className="w-full" 
            onClick={handleAddNote}
            disabled={!newNote.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>
    </div>
  );
};
