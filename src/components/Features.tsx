
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChefHat, Clock, CreditCard, Users, BarChart2, Calendar, Settings, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Features = ({ showViewAllButton = false }: { showViewAllButton?: boolean }) => {
  const features = [
    {
      icon: <ChefHat className="h-8 w-8 text-primary" />,
      title: "Smart Kitchen Management",
      description: "AI-powered kitchen display system with real-time order tracking and ingredient management.",
      image: "/photo-1556911220-e15b29be8c8f" // Modern restaurant kitchen
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Advanced Staff Scheduling",
      description: "Automated scheduling with time tracking, payroll integration, and shift management.",
      image: "/photo-1600565193348-f74bd3c7ccdf" // Restaurant staff at work
    },
    {
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      title: "Seamless Payment Processing",
      description: "Integrated POS system with multiple payment options and automated receipt generation.",
      image: "/photo-1556742502-ec7c0e9f34b1" // Payment terminal in restaurant
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Customer Relationship Management",
      description: "Track customer preferences, loyalty programs, and personalized marketing campaigns.",
      image: "/photo-1559329007-40df8a9345d8" // Happy restaurant customers
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      title: "Real-time Analytics",
      description: "Comprehensive reporting with sales trends, inventory metrics, and performance insights.",
      image: "/photo-1557804506-669a67965ba0" // Business analytics on tablet
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Reservation System",
      description: "Digital reservation management with automated confirmations and table assignments.",
      image: "/photo-1414235077428-338989a2e8c0" // Restaurant interior with tables
    },
    {
      icon: <Settings className="h-8 w-8 text-primary" />,
      title: "Inventory Control",
      description: "Automated stock tracking, supplier management, and low-stock alerts.",
      image: "/photo-1553272725-086100aecf5e" // Restaurant storage/inventory
    },
    {
      icon: <Inbox className="h-8 w-8 text-primary" />,
      title: "Employee Portal",
      description: "Dedicated staff interface for schedules, payroll, and internal communications.",
      image: "/photo-1600880292203-757bb62b4baf" // Restaurant team meeting
    }
  ];

  if (!showViewAllButton) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white transition-colors animate-in">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors animate-in stagger-1 mb-8">
              Discover how MaestroAI revolutionizes restaurant management with cutting-edge features
            </p>
            <Button asChild className="mt-6">
              <Link to="/features">Learn More</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.slice(0, 4).map((feature, index) => (
              <div 
                key={feature.title}
                className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 animate-in stagger-2"
                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
              >
                <div className="mb-4 p-2 rounded-lg bg-primary/10 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
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
            Comprehensive Restaurant Management
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors animate-in stagger-1 mb-8">
            Experience the future of restaurant management with our all-in-one platform
          </p>
          <div className="relative w-full h-64 mb-12 rounded-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9"
              alt="Modern Restaurant Management"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
          </div>
          <Button asChild size="lg" className="text-lg px-8 py-6 animate-in stagger-2">
            <Link to="/dashboard" className="flex items-center gap-2">
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-in dark:bg-gray-800/50"
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`https://images.unsplash.com${feature.image}`}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
