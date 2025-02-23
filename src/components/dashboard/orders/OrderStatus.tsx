
import { Clock, RefreshCcw, Check, ShoppingBag, AlertTriangle } from "lucide-react";
import type { Order } from "@/types/staff";

interface OrderStatusProps {
  status: Order["status"];
}

export const OrderStatus = ({ status }: OrderStatusProps) => {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "preparing":
        return "bg-blue-100 text-blue-700";
      case "ready":
        return "bg-green-100 text-green-700";
      case "delivered":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "preparing":
        return <RefreshCcw className="h-4 w-4" />;
      case "ready":
        return <Check className="h-4 w-4" />;
      case "delivered":
        return <ShoppingBag className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {status}
    </span>
  );
};
