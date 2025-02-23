
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Image, Plus, Upload, Edit2, Trash2, DollarSign, Clock, Info } from "lucide-react";
import type { MenuItem } from "@/types/staff";
import { useState, useRef } from "react";

interface MenuPanelProps {
  menuItems: MenuItem[];
  onAddMenuItem: (item: Omit<MenuItem, "id">) => void;
  onUpdateAvailability: (itemId: number, available: boolean) => void;
  onUpdatePrice: (itemId: number, price: number) => void;
  onDeleteMenuItem?: (itemId: number) => void;
  onUpdateMenuItem?: (itemId: number, item: Partial<MenuItem>) => void;
}

export const MenuPanel = ({
  menuItems,
  onAddMenuItem,
  onUpdateAvailability,
  onUpdatePrice,
  onDeleteMenuItem,
  onUpdateMenuItem,
}: MenuPanelProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<MenuItem["category"] | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    price: 0,
    category: "main",
    description: "",
    available: true,
    allergens: [],
    preparationTime: 15,
    image: undefined,
  });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isEditing: boolean = false) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEditing && editingItem) {
          onUpdateMenuItem?.(editingItem.id, { image: base64String });
          setEditingItem({ ...editingItem, image: base64String });
        } else {
          setNewItem({ ...newItem, image: base64String });
        }
        toast({
          title: "Image uploaded",
          description: "The image has been successfully uploaded.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleAddItem = () => {
    if (!newItem.name || newItem.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    onAddMenuItem(newItem);
    setNewItem({
      name: "",
      price: 0,
      category: "main",
      description: "",
      available: true,
      allergens: [],
      preparationTime: 15,
      image: undefined,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Menu Management</h2>
            <p className="text-muted-foreground">Manage your restaurant's menu items</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image</label>
                  <div className="flex items-center gap-4">
                    {newItem.image ? (
                      <div className="relative w-32 h-32">
                        <img
                          src={newItem.image}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute top-1 right-1"
                          onClick={() => setNewItem({ ...newItem, image: undefined })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 flex flex-col items-center justify-center gap-2"
                      >
                        <Upload className="h-6 w-6" />
                        <span className="text-sm">Upload Image</span>
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Item name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value: MenuItem["category"]) =>
                      setNewItem({ ...newItem, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appetizer">Appetizer</SelectItem>
                      <SelectItem value="main">Main Course</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                      <SelectItem value="beverage">Beverage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    placeholder="Price"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Description"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Preparation Time (minutes)</label>
                  <Input
                    type="number"
                    value={newItem.preparationTime}
                    onChange={(e) => setNewItem({ ...newItem, preparationTime: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Allergens (comma-separated)</label>
                  <Input
                    value={newItem.allergens.join(", ")}
                    onChange={(e) => setNewItem({ ...newItem, allergens: e.target.value.split(",").map(a => a.trim()) })}
                    placeholder="e.g., nuts, dairy, gluten"
                  />
                </div>

                <Button className="w-full" onClick={handleAddItem}>
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Select
            value={selectedCategory}
            onValueChange={(value: MenuItem["category"] | "all") => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="appetizer">Appetizers</SelectItem>
              <SelectItem value="main">Main Courses</SelectItem>
              <SelectItem value="dessert">Desserts</SelectItem>
              <SelectItem value="beverage">Beverages</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <Table className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Switch
                      checked={item.available}
                      onCheckedChange={(checked) => onUpdateAvailability(item.id, checked)}
                    />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    {item.preparationTime} min
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Info className="h-4 w-4" />
                    {item.allergens.join(", ") || "No allergens"}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => onUpdatePrice(item.id, Number(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {onDeleteMenuItem && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDeleteMenuItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Prep Time</TableHead>
                <TableHead>Allergens</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <Image className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => onUpdatePrice(item.id, Number(e.target.value))}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>{item.preparationTime} min</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {item.allergens.join(", ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={item.available}
                      onCheckedChange={(checked) => onUpdateAvailability(item.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      {onDeleteMenuItem && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDeleteMenuItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No menu items found in this category
          </div>
        )}

        {editingItem && (
          <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
            <DialogContent className="max

-w-md">
              <DialogHeader>
                <DialogTitle>Edit Menu Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Image</label>
                  <div className="flex items-center gap-4">
                    {editingItem.image ? (
                      <div className="relative w-32 h-32">
                        <img
                          src={editingItem.image}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute top-1 right-1"
                          onClick={() => onUpdateMenuItem?.(editingItem.id, { image: undefined })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 flex flex-col items-center justify-center gap-2"
                      >
                        <Upload className="h-6 w-6" />
                        <span className="text-sm">Upload Image</span>
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, true)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Preparation Time (minutes)</label>
                  <Input
                    type="number"
                    value={editingItem.preparationTime}
                    onChange={(e) => setEditingItem({ ...editingItem, preparationTime: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Allergens</label>
                  <Input
                    value={editingItem.allergens.join(", ")}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      allergens: e.target.value.split(",").map(a => a.trim())
                    })}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={() => {
                    onUpdateMenuItem?.(editingItem.id, editingItem);
                    setEditingItem(null);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </Card>
    </div>
  );
};
