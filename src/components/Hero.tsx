
import { Button } from "@/components/ui/button";
import { ArrowRight, ChefHat, BarChart, Clock } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
            <div className="max-w-lg mx-auto lg:mx-0">
              <span className="inline-block py-1 px-3 mb-5 text-sm text-sage-500 dark:text-sage-400 font-semibold bg-sage-50 dark:bg-sage-900/50 rounded-full animate-in stagger-1">
                Restaurant Management Made Simple
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-7 animate-in stagger-2 dark:text-white transition-colors">
                Unlock Your Restaurant's{" "}
                <span className="text-sage-500 dark:text-sage-400">Full Potential</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 animate-in stagger-3 transition-colors">
                Streamline operations, boost efficiency, and grow your business with
                our all-in-one restaurant management solution.
              </p>
              <div className="flex flex-wrap gap-4 animate-in stagger-4">
                <Button className="bg-sage-500 hover:bg-sage-600 dark:bg-sage-600 dark:hover:bg-sage-700">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="dark:border-gray-700 dark:text-white dark:hover:bg-gray-800">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <div className="flex flex-wrap lg:ml-10">
              <div className="w-full md:w-1/2 p-4">
                <div className="feature-card animate-in stagger-2">
                  <ChefHat className="h-8 w-8 text-sage-500 dark:text-sage-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 dark:text-white transition-colors">
                    Kitchen Management
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">
                    Optimize your kitchen operations and inventory in real-time
                  </p>
                </div>
                <div className="feature-card mt-8 animate-in stagger-3">
                  <BarChart className="h-8 w-8 text-sage-500 dark:text-sage-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 dark:text-white transition-colors">
                    Smart Analytics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">
                    Data-driven insights to boost your restaurant's performance
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/2 p-4 md:mt-10">
                <div className="feature-card animate-in stagger-4">
                  <Clock className="h-8 w-8 text-sage-500 dark:text-sage-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 dark:text-white transition-colors">
                    Real-time Updates
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 transition-colors">
                    Stay on top of your business from anywhere, anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
