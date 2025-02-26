
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface OrderTimerProps {
  startTime: string;
  estimatedTime: string;
}

export function OrderTimer({ startTime, estimatedTime }: OrderTimerProps) {
  const [timeElapsed, setTimeElapsed] = useState<string>("");
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const start = new Date(startTime).getTime();
      const estimated = new Date(estimatedTime).getTime();
      const now = new Date().getTime();
      const elapsed = now - start;
      
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      
      setTimeElapsed(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      setIsOverdue(now > estimated);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, estimatedTime]);

  return (
    <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
      <Clock className="h-4 w-4" />
      <span className="text-sm">{timeElapsed}</span>
    </div>
  );
}
