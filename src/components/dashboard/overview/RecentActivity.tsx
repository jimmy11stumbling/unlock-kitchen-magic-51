
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface Activity {
  time: string;
  action: string;
  status: "pending" | "completed" | "alert";
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-sage-100 dark:bg-sage-900 rounded-full">
                <Clock className="h-4 w-4 text-sage-500 dark:text-sage-400" />
              </div>
              <div>
                <p className="text-sm font-medium dark:text-white">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              activity.status === "completed" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
              activity.status === "alert" ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
              "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}>
              {activity.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
