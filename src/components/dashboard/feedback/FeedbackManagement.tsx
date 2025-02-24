
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFeedbackManagement } from "@/hooks/dashboard/useFeedbackManagement";
import { format } from "date-fns";

export const FeedbackManagement = () => {
  const { feedback, isLoading, resolveFeedback } = useFeedbackManagement();

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Loading feedback...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Feedback</h2>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedback.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>
                  {format(new Date(item.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{item.customer_profiles?.name || 'Unknown'}</TableCell>
                <TableCell>#{item.order_id}</TableCell>
                <TableCell>{item.rating} / 5</TableCell>
                <TableCell className="max-w-md truncate">
                  {item.comment || 'No comment'}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={item.status === 'resolved' ? 'default' : 'secondary'}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {item.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveFeedback(item.id, 'current-user-id')}
                    >
                      Resolve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {feedback.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No feedback entries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
