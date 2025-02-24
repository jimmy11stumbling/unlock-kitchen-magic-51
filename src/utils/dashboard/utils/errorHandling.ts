
import { toast } from "@/components/ui/use-toast";

export const handleError = (error: Error, context: string) => {
  console.error(`Error in ${context}:`, error);
  
  toast({
    title: "Error",
    description: error.message || `An error occurred in ${context}`,
    variant: "destructive",
  });
};

export const validateInput = <T>(data: T, requiredFields: (keyof T)[]): string[] => {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!data[field]) {
      errors.push(`${String(field)} is required`);
    }
  });
  
  return errors;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
