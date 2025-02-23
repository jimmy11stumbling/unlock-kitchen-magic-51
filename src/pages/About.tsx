
import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">MaestroAI</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 pt-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About MaestroAI</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                MaestroAI is revolutionizing restaurant management by bringing artificial intelligence to every aspect of your operations. Our mission is to empower restaurants of all sizes with smart, intuitive tools that make running your business easier and more efficient.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Smart Management</h3>
                  <p className="text-muted-foreground">
                    Streamline your operations with AI-powered inventory management, staff scheduling, and real-time analytics.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Customer Experience</h3>
                  <p className="text-muted-foreground">
                    Enhance customer satisfaction with intelligent table management and personalized service recommendations.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">Data Insights</h3>
                  <p className="text-muted-foreground">
                    Make informed decisions with comprehensive analytics and predictive modeling.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-medium">24/7 Support</h3>
                  <p className="text-muted-foreground">
                    Get help when you need it with our dedicated support team and extensive documentation.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Get Started Today</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Join the hundreds of restaurants already using MaestroAI to transform their operations and boost their bottom line.
              </p>
              <Link to="/">
                <Button size="lg">Start Your Journey</Button>
              </Link>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t mt-20">
        <div className="container flex flex-col md:flex-row justify-between items-center py-8 px-4">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">MaestroAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 MaestroAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
