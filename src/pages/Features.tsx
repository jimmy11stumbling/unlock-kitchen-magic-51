
import { Features as FeaturesComponent } from "@/components/Features";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturesPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" className="rounded-full" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <FeaturesComponent />
    </main>
  );
};

export default FeaturesPage;
