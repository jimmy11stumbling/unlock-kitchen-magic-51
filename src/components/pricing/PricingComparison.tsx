
import { Check, X } from "lucide-react";
import { PricingFeature } from "@/types/pricing";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const features: PricingFeature[] = [
  {
    name: "Staff Members",
    description: "Number of staff accounts",
    included: {
      starter: true,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "Menu Management",
    included: {
      starter: true,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "Table Management",
    included: {
      starter: true,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "Basic Reporting",
    included: {
      starter: true,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "Advanced Analytics",
    included: {
      starter: false,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "Inventory Management",
    included: {
      starter: false,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "Customer Feedback System",
    included: {
      starter: false,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "Priority Support",
    included: {
      starter: false,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "API Access",
    included: {
      starter: false,
      professional: false,
      enterprise: true,
    },
  },
  {
    name: "Custom Integrations",
    included: {
      starter: false,
      professional: false,
      enterprise: true,
    },
  },
];

export const PricingComparison = () => {
  return (
    <div className="w-full overflow-x-auto animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Feature</TableHead>
            <TableHead className="text-center">Starter</TableHead>
            <TableHead className="text-center">Professional</TableHead>
            <TableHead className="text-center">Enterprise</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature) => (
            <TableRow key={feature.name}>
              <TableCell className="font-medium">
                {feature.name}
                {feature.description && (
                  <span className="block text-sm text-muted-foreground">
                    {feature.description}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {feature.included.starter ? (
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                ) : (
                  <X className="w-5 h-5 text-red-500 mx-auto" />
                )}
              </TableCell>
              <TableCell className="text-center">
                {feature.included.professional ? (
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                ) : (
                  <X className="w-5 h-5 text-red-500 mx-auto" />
                )}
              </TableCell>
              <TableCell className="text-center">
                {feature.included.enterprise ? (
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                ) : (
                  <X className="w-5 h-5 text-red-500 mx-auto" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
