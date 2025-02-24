
import { FeedbackPanel } from "@/components/dashboard/FeedbackPanel";
import { useDashboardState } from "@/hooks/useDashboardState";

const Feedback = () => {
  const { feedback, resolveFeedback } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Customer Feedback</h1>
      <FeedbackPanel
        feedback={feedback}
        onResolveFeedback={resolveFeedback}
      />
    </div>
  );
};

export default Feedback;
