
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChefHat, Clock, CreditCard, Users, BarChart2, Calendar, Settings, Inbox } from "lucide-react";

export const Features = ({ showViewAllButton = false }: { showViewAllButton?: boolean }) => {
  const features = [
    {
      icon: <ChefHat className="h-8 w-8 text-primary" />,
      title: "Smart Kitchen Management",
      description: "AI-powered kitchen display system with real-time order tracking and ingredient management."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Advanced Staff Scheduling",
      description: "Automated scheduling with time tracking, payroll integration, and shift management."
    },
    {
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      title: "Seamless Payment Processing",
      description: "Integrated POS system with multiple payment options and automated receipt generation."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Customer Relationship Management",
      description: "Track customer preferences, loyalty programs, and personalized marketing campaigns."
    },
    {
      icon: <BarChart2 className="h-8 w-8 text-primary" />,
      title: "Real-time Analytics",
      description: "Comprehensive reporting with sales trends, inventory metrics, and performance insights."
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Reservation System",
      description: "Digital reservation management with automated confirmations and table assignments."
    },
    {
      icon: <Settings className="h-8 w-8 text-primary" />,
      title: "Inventory Control",
      description: "Automated stock tracking, supplier management, and low-stock alerts."
    },
    {
      icon: <Inbox className="h-8 w-8 text-primary" />,
      title: "Employee Portal",
      description: "Dedicated staff interface for schedules, payroll, and internal communications."
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
          <Button asChild size="lg" className="text-lg px-8 py-6 animate-in stagger-2">
            <Link to="/dashboard" className="flex items-center gap-2">
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 animate-in"
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
};
