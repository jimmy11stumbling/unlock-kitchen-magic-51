
import type { Order, KitchenOrder } from "@/types/staff";

export const initialOrders: Order[] = [
  {
    id: 1,
    tableNumber: 5,
    status: "pending",
    items: [
      { id: 1, name: "Truffle Wagyu Burger", quantity: 2, price: 24.99 },
      { id: 3, name: "Lobster Bisque", quantity: 1, price: 16.99 },
      { id: 6, name: "Signature Martini", quantity: 2, price: 15.99 }
    ],
    total: 98.95,
    timestamp: new Date().toISOString(),
    serverName: "Sofia Chen",
    specialInstructions: "Allergy: dairy",
    guestCount: 4,
    estimatedPrepTime: 35
  },
  {
    id: 2,
    tableNumber: 3,
    status: "preparing",
    items: [
      { id: 2, name: "Mediterranean Quinoa Bowl", quantity: 1, price: 18.99 },
      { id: 4, name: "Tuna Tartare", quantity: 2, price: 19.99 }
    ],
    total: 58.97,
    timestamp: new Date().toISOString(),
    serverName: "James Wilson",
    specialInstructions: "VIP Guest - Priority Service",
    guestCount: 2,
    estimatedPrepTime: 25
  }
];

export const initialKitchenOrders: KitchenOrder[] = [
  {
    id: 1,
    orderId: 1,
    tableNumber: 5,
    serverName: "Sofia Chen",
    status: "new",
    timestamp: new Date().toISOString(),
    estimatedPrepTime: 30,
    specialInstructions: "Allergy: dairy",
    items: [
      {
        name: "Truffle Wagyu Burger",
        menuItemId: 1,
        quantity: 2,
        status: "preparing",
        startTime: new Date(Date.now() - 900000).toISOString(),
        cookingStation: "grill",
        assignedChef: "Isabella Martinez",
        modifications: ["1x Medium Rare", "1x Medium Well"],
        allergenAlert: true
      },
      {
        name: "Lobster Bisque",
        menuItemId: 3,
        quantity: 1,
        status: "pending",
        startTime: new Date().toISOString(),
        cookingStation: "soup",
        assignedChef: "James Wilson",
        modifications: ["No cream"],
        allergenAlert: true
      },
      {
        name: "Signature Martini",
        menuItemId: 6,
        quantity: 2,
        status: "ready",
        startTime: new Date(Date.now() - 600000).toISOString(),
        completionTime: new Date().toISOString(),
        cookingStation: "bar",
        assignedChef: "Alex Thompson",
        modifications: [],
        allergenAlert: false
      }
    ],
    priority: "high",
    notes: "Dairy allergy - use alternatives where possible",
    coursing: "standard",
    estimatedDeliveryTime: new Date(Date.now() + 1200000).toISOString()
  },
  {
    id: 2,
    orderId: 2,
    tableNumber: 3,
    serverName: "James Wilson",
    status: "in-progress",
    timestamp: new Date().toISOString(),
    estimatedPrepTime: 25,
    specialInstructions: "VIP Guest - Priority Service",
    items: [
      {
        name: "Mediterranean Quinoa Bowl",
        menuItemId: 2,
        quantity: 1,
        status: "preparing",
        startTime: new Date().toISOString(),
        cookingStation: "cold-line",
        assignedChef: "James Wilson",
        modifications: ["Extra feta on side"],
        allergenAlert: false
      },
      {
        name: "Tuna Tartare",
        menuItemId: 4,
        quantity: 2,
        status: "pending",
        startTime: new Date().toISOString(),
        cookingStation: "cold-line",
        assignedChef: "James Wilson",
        modifications: ["Spicy"],
        allergenAlert: false
      }
    ],
    priority: "rush",
    notes: "VIP Guest - Priority Service",
    coursing: "standard",
    estimatedDeliveryTime: new Date(Date.now() + 900000).toISOString()
  }
];
