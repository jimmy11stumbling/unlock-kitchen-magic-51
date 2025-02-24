
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { TestingPanel } from "@/components/dashboard/TestingPanel";

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Hero />
      <Features />
      <div className="mt-8">
        <TestingPanel />
      </div>
    </div>
  );
};

export default Index;
