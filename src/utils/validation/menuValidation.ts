
import type { MenuItem } from "@/types/staff";

export const validateMenuItem = (item: MenuItem): string[] => {
  const errors: string[] = [];
  
  if (!item.name?.trim()) errors.push("Name is required");
  if (item.price <= 0) errors.push("Price must be greater than 0");
  if (!item.category) errors.push("Category is required");
  if (!item.description?.trim()) errors.push("Description is required");
  
  return errors;
};

export const validateImage = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve(img.width >= 300 && img.height >= 300);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const sanitizeDescription = (description: string): string => {
  return description
    .trim()
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .slice(0, 500); // Limit length
};
