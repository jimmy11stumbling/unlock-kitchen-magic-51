
import * as z from "zod";

export const businessHoursSchema = z.record(z.object({
  open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
}));

export const restaurantInfoSchema = z.object({
  name: z.string().min(1, "Restaurant name is required").max(100),
  address: z.string().min(1, "Address is required"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
  state: z.string().min(1, "State is required"),
  businessHours: businessHoursSchema,
});

export const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  tables: z.number().min(1, "Must have at least one table"),
});

export const layoutInfoSchema = z.object({
  sections: z.array(sectionSchema).min(1, "At least one section is required"),
  defaultCapacities: z.array(z.number().min(1, "Capacity must be at least 1")),
});

export type RestaurantInfoSchema = z.infer<typeof restaurantInfoSchema>;
export type LayoutInfoSchema = z.infer<typeof layoutInfoSchema>;
