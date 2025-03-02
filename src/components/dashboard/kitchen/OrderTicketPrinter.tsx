
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import type { KitchenOrder } from "@/types/staff";

interface OrderTicketPrinterProps {
  order: KitchenOrder;
}

export function OrderTicketPrinter({ order }: OrderTicketPrinterProps) {
  const printTicket = async () => {
    try {
      // Format ticket data
      const ticketContent = `
        ORDER #${order.order_id}
        Table: ${order.tableNumber}
        Server: ${order.serverName}
        Time: ${new Date().toLocaleTimeString()}
        
        Items:
        ${order.items.map(item => `
          - ${item.quantity}x ${item.name}
          ${item.notes ? `  Notes: ${item.notes}` : ''}
          ${item.allergens?.length ? `  Allergens: ${item.allergens.join(', ')}` : ''}
        `).join('\n')}
      `;

      // Use browser's print API
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Order Ticket #${order.order_id}</title>
              <style>
                body { font-family: monospace; padding: 20px; }
                .ticket { white-space: pre-wrap; }
              </style>
            </head>
            <body>
              <div class="ticket">${ticketContent}</div>
              <script>
                window.onload = () => {
                  window.print();
                  window.close();
                }
              </script>
            </body>
          </html>
        `);
      }
      
      toast({
        title: "Ticket printed",
        description: `Order #${order.order_id} ticket has been sent to printer`,
      });
    } catch (error) {
      toast({
        title: "Print failed",
        description: "Could not print order ticket",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={printTicket}
      className="flex items-center gap-2"
    >
      <Printer className="h-4 w-4" />
      Print Ticket
    </Button>
  );
}
