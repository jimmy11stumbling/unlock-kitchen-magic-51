
import { useState } from "react";
import type { CustomerFeedback } from "@/types/staff";

export const useFeedback = () => {
  const [feedback, setFeedback] = useState<CustomerFeedback[]>([]);
  const [error, setError] = useState<string | null>(null);

  const resolveFeedback = (feedbackId: number) => {
    try {
      setFeedback(
        feedback.map((item) =>
          item.id === feedbackId ? { ...item, resolved: true } : item
        )
      );
    } catch (err) {
      setError("Failed to resolve feedback");
      throw err;
    }
  };

  return {
    feedback,
    error,
    resolveFeedback,
  };
};
