
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, Gauge, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background via-background/90 to-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Automate Your Business Flow
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl dark:text-gray-400">
              Streamline operations, boost productivity, and drive growth with intelligent automation solutions.
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/dashboard">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/features">
                Learn More
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: <Bot className="h-6 w-6" />,
                title: "AI-Powered",
                description: "Intelligent automation that learns and adapts to your business needs"
              },
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Lightning Fast",
                description: "Real-time processing and instant updates across your organization"
              },
              {
                icon: <Gauge className="h-6 w-6" />,
                title: "Scalable",
                description: "Built to grow with your business, from startup to enterprise"
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-white/5">
                <div className="p-2 rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-400 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
