
import { useEffect, useState } from "react";
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
  
  useEffect(() => {
    if (status !== 'preparing') return;

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

    setTimeRemaining(calculateTimeRemaining());

    // Play alert sound when less than 5 minutes remaining
    if (timeRemaining <= 5 && timeRemaining > 0) {
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch(console.error);
      
      toast({
        title: "Order Time Alert",
        description: `Order #${orderId} has ${timeRemaining} minutes remaining!`,
        variant: "destructive",
      });
    }

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, estimatedDeliveryTime, status, timeRemaining, orderId, toast]);

  if (status !== 'preparing') return null;

  const isUrgent = timeRemaining <= 5;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-2">
        <Clock className={`h-4 w-4 ${isUrgent ? 'text-red-500' : 'text-gray-500'}`} />
        <span className={`text-sm ${isUrgent ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
          {timeRemaining} minutes remaining
        </span>
        {isUrgent && <AlertTriangle className="h-4 w-4 text-red-500" />}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
