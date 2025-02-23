
import {
  Wallet,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Calendar,
  PieChart,
} from "lucide-react";

const features = [
  {
    icon: <LayoutDashboard className="h-6 w-6" />,
    title: "Intuitive Dashboard",
    description:
      "Get a complete overview of your restaurant's performance at a glance",
  },
  {
    icon: <ShoppingCart className="h-6 w-6" />,
    title: "Inventory Control",
    description:
      "Track stock levels and get automated alerts for low inventory items",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Staff Management",
    description: "Efficiently manage schedules, payroll, and staff performance",
  },
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Reservation System",
    description: "Handle bookings and manage table assignments seamlessly",
  },
  {
    icon: <PieChart className="h-6 w-6" />,
    title: "Sales Analytics",
    description: "Track revenue, costs, and profit margins in real-time",
  },
  {
    icon: <Wallet className="h-6 w-6" />,
    title: "Payment Processing",
    description: "Accept payments and manage transactions securely",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features designed to help you manage and grow your restaurant
            business efficiently
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-6 bg-sage-100 text-sage-500 rounded-xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
