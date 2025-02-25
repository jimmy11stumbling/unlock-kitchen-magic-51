
import type { MenuItem } from "@/types/staff";

export const validateMenuItem = (item: Partial<MenuItem>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!item.name?.trim()) {
    errors.push("Name is required");
  }

  if (typeof item.price !== 'number' || item.price < 0) {
    errors.push("Price must be a positive number");
  }

  if (!item.category) {
    errors.push("Category is required");
  }

  if (!item.description?.trim()) {
    errors.push("Description is required");
  }

  if (typeof item.preparationTime !== 'number' || item.preparationTime < 0) {
    errors.push("Preparation time must be a positive number");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeMenuItemInput = (item: Partial<MenuItem>): Partial<MenuItem> => {
  return {
    ...item,
    name: item.name?.trim(),
    description: item.description?.trim(),
    price: Number(item.price),
    preparationTime: Number(item.preparationTime),
    allergens: Array.isArray(item.allergens) ? item.allergens.map(a => a.trim()).filter(Boolean) : []
  };
};
