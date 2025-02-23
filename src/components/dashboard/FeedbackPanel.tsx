
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CustomerFeedback } from "@/types/staff";
import { Star, CheckCircle2, XCircle } from "lucide-react";

interface FeedbackPanelProps {
  feedback: CustomerFeedback[];
  onResolveFeedback: (id: number) => void;
}

export const FeedbackPanel = ({
  feedback,
  onResolveFeedback,
}: FeedbackPanelProps) => {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Customer Feedback</h2>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
          <Button variant="outline">Analytics</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedback.map((item) => (
            <TableRow key={item.id}>
              <TableCell>#{item.orderId}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < item.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell className="max-w-md truncate">{item.comment}</TableCell>
              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
              <TableCell>
                {item.resolved ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Resolved
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <XCircle className="w-4 h-4 mr-1" />
                    Pending
                  </span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant={item.resolved ? "outline" : "default"}
                  onClick={() => onResolveFeedback(item.id)}
                  disabled={item.resolved}
                >
                  {item.resolved ? "Resolved" : "Mark as Resolved"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
