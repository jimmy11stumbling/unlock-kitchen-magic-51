
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { vendorService } from "./services/vendorService";
import { 
  Plus, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Star, 
  Edit, 
  Trash 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  primary: boolean;
}

interface ContactsListProps {
  vendorId: number;
  onUpdate: () => void;
}

export const ContactsList = ({ vendorId, onUpdate }: ContactsListProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    primary: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, [vendorId]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const data = await vendorService.getVendorContacts(vendorId);
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch vendor contacts:", error);
      toast({
        title: "Error",
        description: "Failed to load vendor contacts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, primary: checked }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      email: "",
      phone: "",
      primary: false
    });
    setEditingContact(null);
  };

  const openEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      role: contact.role,
      email: contact.email,
      phone: contact.phone,
      primary: contact.primary
    });
    setContactDialogOpen(true);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    try {
      // If primary is true, update all other contacts to non-primary
      if (formData.primary) {
        setContacts(prev => 
          prev.map(c => ({
            ...c,
            primary: false
          }))
        );
      }

      if (editingContact) {
        // Update existing contact
        const updatedContact = {
          ...editingContact,
          ...formData
        };
        setContacts(prev => 
          prev.map(c => c.id === editingContact.id ? updatedContact : c)
        );
      } else {
        // Add new contact
        const newContact: Contact = {
          id: Math.random().toString(36).substring(2, 11),
          ...formData
        };
        setContacts(prev => [...prev, newContact]);
      }
      
      resetForm();
      setContactDialogOpen(false);
      toast({
        title: "Success",
        description: editingContact ? "Contact updated" : "Contact added",
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to save contact:", error);
      toast({
        title: "Error",
        description: "Failed to save contact",
        variant: "destructive"
      });
    }
  };

  const handleDeleteContact = (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;
    
    try {
      setContacts(prev => prev.filter(c => c.id !== contactId));
      toast({
        title: "Success",
        description: "Contact deleted"
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to delete contact:", error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Contacts</h3>
        <Dialog open={contactDialogOpen} onOpenChange={(open) => {
          setContactDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingContact ? "Edit Contact" : "Add Contact"}</DialogTitle>
              <DialogDescription>
                {editingContact 
                  ? "Update contact information for this vendor" 
                  : "Add a new contact for this vendor"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Primary
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox 
                    id="primary" 
                    checked={formData.primary}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="primary">Primary contact</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                resetForm();
                setContactDialogOpen(false);
              }}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingContact ? "Save Changes" : "Add Contact"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading contacts...</div>
      ) : contacts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <User className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No contacts have been added yet.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setContactDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <Card key={contact.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium">{contact.name}</h4>
                        {contact.primary && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            <Star className="h-3 w-3 mr-1" /> Primary
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center mt-1">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {contact.role}
                      </div>
                      <div className="mt-2 grid gap-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-2" />
                          <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-2" />
                          <a href={`tel:${contact.phone}`} className="hover:underline">
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditDialog(contact)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
