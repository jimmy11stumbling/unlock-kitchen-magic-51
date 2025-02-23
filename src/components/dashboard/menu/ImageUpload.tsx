
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { useRef } from "react";

interface ImageUploadProps {
  image?: string;
  onImageUpload: (image: string) => void;
  onImageRemove: () => void;
}

export const ImageUpload = ({ image, onImageUpload, onImageRemove }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {image ? (
        <div className="relative w-32 h-32">
          <img
            src={image}
            alt="Preview"
            className="w-full h-full object-cover rounded-md"
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1 right-1"
            onClick={onImageRemove}
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
        onChange={handleImageUpload}
      />
    </div>
  );
};
