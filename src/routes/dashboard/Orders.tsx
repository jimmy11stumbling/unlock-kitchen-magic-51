
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Orders System Update",
      description: "The orders system is being rebuilt around the Tables interface. Redirecting to Tables...",
    });
    navigate("/dashboard/tables");
  }, [navigate, toast]);

  return null;
};

export default Orders;
