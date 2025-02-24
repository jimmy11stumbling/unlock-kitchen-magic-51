
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChefHat, Utensils, Clock, LineChart } from "lucide-react";

export function Hero() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1556910103-1c02745aae4d"
          alt="Rustic Restaurant Kitchen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background pointer-events-none" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-4 animate-fade-in">
            <div className="w-24 h-24 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <ChefHat className="w-12 h-12 text-primary animate-float" />
            </div>
            <span className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-gray-400 animate-pulse duration-[3000ms] hover:scale-110 transition-transform cursor-default">
              MaestroAI
            </span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Intelligent Restaurant Management
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl dark:text-gray-400">
              Transform your restaurant operations with AI-powered automation. From kitchen to table, MaestroAI orchestrates everything.
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
                icon: <ChefHat className="h-6 w-6" />,
                title: "Kitchen Management",
                description: "Optimize kitchen operations with smart order routing and prep timing"
              },
              {
                icon: <Utensils className="h-6 w-6" />,
                title: "Table Service",
                description: "Seamless order taking and service management for your front-of-house"
              },
              {
                icon: <LineChart className="h-6 w-6" />,
                title: "Business Analytics",
                description: "Real-time insights into your restaurant's performance and trends"
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-gray-300 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
