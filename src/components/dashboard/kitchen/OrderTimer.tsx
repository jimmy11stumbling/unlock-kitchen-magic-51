
import { useEffect, useState, useRef } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface OrderTimerProps {
  startTime: string;
  estimatedDeliveryTime: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  orderId: number;
}

export function OrderTimer({ startTime, estimatedDeliveryTime, status, orderId }: OrderTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [progress, setProgress] = useState(100);
  const { toast } = useToast();
  const alertShownRef = useRef<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (status !== 'preparing') return;
    
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/notification.mp3');
    }

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const end = new Date(estimatedDeliveryTime).getTime();
      const total = end - start;
      const elapsed = now - start;
      const remaining = end - now;
      
      // Calculate progress percentage
      const progressValue = Math.max(0, Math.min(100, ((total - elapsed) / total) * 100));
      setProgress(progressValue);
      
      return Math.max(0, Math.floor(remaining / 1000 / 60)); // Convert to minutes
    };

    // Initial calculation
    const remaining = calculateTimeRemaining();
    setTimeRemaining(remaining);
    
    // Check if we should show alert
    if (remaining <= 5 && remaining > 0 && !alertShownRef.current) {
      alertShownRef.current = true;
      
      // Play sound alert
      audioRef.current?.play().catch(error => {
        console.error("Error playing alert sound:", error);
      });
      
      // Show toast notification
      toast({
        title: "Order Time Alert",
        description: `Order #${orderId} has ${remaining} minutes remaining!`,
        variant: "destructive",
      });
    }
    
    // Reset alert flag if time increases back above threshold
    if (remaining > 5) {
      alertShownRef.current = false;
    }

    const timer = setInterval(() => {
      const newRemaining = calculateTimeRemaining();
      setTimeRemaining(newRemaining);
      
      // Check if we've hit zero
      if (newRemaining === 0 && timeRemaining > 0) {
        toast({
          title: "Order Time Alert",
          description: `Order #${orderId} preparation time has elapsed!`,
          variant: "destructive",
        });
        
        audioRef.current?.play().catch(console.error);
      }
      
      // Alert at the 5 minute mark, but only once
      if (newRemaining <= 5 && newRemaining > 0 && !alertShownRef.current) {
        alertShownRef.current = true;
        
        audioRef.current?.play().catch(console.error);
        
        toast({
          title: "Order Time Alert",
          description: `Order #${orderId} has ${newRemaining} minutes remaining!`,
          variant: "destructive",
        });
      }
      
      // Reset alert flag if time increases back above threshold (in case of order time update)
      if (newRemaining > 5) {
        alertShownRef.current = false;
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      // Clean up audio when component unmounts
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [startTime, estimatedDeliveryTime, status, orderId, toast]);

  // Don't render anything if the order is not being prepared
  if (status !== 'preparing') return null;

  const isUrgent = timeRemaining <= 5;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <Clock className={`h-4 w-4 ${isUrgent ? 'text-red-500' : 'text-gray-500'}`} />
        <span className={`text-sm ${isUrgent ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
          {timeRemaining} {timeRemaining === 1 ? 'minute' : 'minutes'} remaining
        </span>
        {isUrgent && <AlertTriangle className="h-4 w-4 text-red-500" />}
      </div>
      <Progress 
        value={progress} 
        className={`h-2 ${isUrgent ? 'bg-red-100' : ''}`} 
        indicatorClassName={isUrgent ? 'bg-red-500' : undefined}
      />
    </div>
  );
}
