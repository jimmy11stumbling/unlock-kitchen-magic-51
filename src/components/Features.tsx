
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Features = ({ showViewAllButton = false }: { showViewAllButton?: boolean }) => {
  if (!showViewAllButton) {
    return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white transition-colors animate-in">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors animate-in stagger-1">
            Powerful features designed to help you manage and grow your restaurant
            business efficiently
          </p>
          <Button asChild className="mt-6">
            <Link to="/features">View All Features</Link>
          </Button>
        </div>
      </div>
    </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white transition-colors animate-in">
            Welcome to Your Restaurant Hub
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors animate-in stagger-1 mb-8">
            Take control of your restaurant operations with our comprehensive management system
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6 animate-in stagger-2">
            <Link to="/dashboard" className="flex items-center gap-2">
              Go to Restaurant Hub <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
