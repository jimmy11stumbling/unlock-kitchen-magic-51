
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12"
};

export function LoadingSpinner({ size = "md", fullScreen = false }: LoadingSpinnerProps) {
  const containerClass = fullScreen 
    ? "fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClass}>
      <Loader2 className={`${sizes[size]} animate-spin text-primary`} />
    </div>
  );
}
