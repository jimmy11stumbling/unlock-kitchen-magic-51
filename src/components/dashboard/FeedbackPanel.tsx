
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Star, CheckCircle2 } from "lucide-react";
import type { CustomerFeedback } from "@/types/staff";

interface FeedbackPanelProps {
  feedback: CustomerFeedback[];
  onResolveFeedback: (feedbackId: number) => void;
}

export const FeedbackPanel = ({ feedback, onResolveFeedback }: FeedbackPanelProps) => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Customer Feedback</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Total: {feedback.length} | Resolved: {feedback.filter(f => f.resolved).length}
          </span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedback.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
              <TableCell>#{item.orderId}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {renderStars(item.rating)}
                </div>
              </TableCell>
              <TableCell className="max-w-md truncate">{item.comment}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.resolved
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {item.resolved ? "Resolved" : "Pending"}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onResolveFeedback(item.id)}
                  disabled={item.resolved}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Mark Resolved
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
