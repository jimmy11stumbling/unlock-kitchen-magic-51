
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-8 w-20" />
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <Skeleton className="h-[300px] w-full" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-[300px] w-full" />
        </Card>
      </div>
    </div>
  );
};
