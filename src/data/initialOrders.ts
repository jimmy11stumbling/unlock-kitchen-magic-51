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
    items: [
      {
        menuItemId: 1,
        itemName: "Truffle Wagyu Burger",
        quantity: 2,
        status: "preparing",
        startTime: new Date(Date.now() - 900000).toISOString(),
        cookingStation: "grill",
        assignedChef: "Isabella Martinez",
        modifications: ["1x Medium Rare", "1x Medium Well"],
        allergenAlert: true
      },
      {
        menuItemId: 3,
        itemName: "Lobster Bisque",
        quantity: 1,
        status: "pending",
        startTime: new Date().toISOString(),
        cookingStation: "soup",
        assignedChef: "James Wilson",
        modifications: ["No cream"],
        allergenAlert: true
      },
      {
        menuItemId: 6,
        itemName: "Signature Martini",
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estimated_delivery_time: new Date(Date.now() + 1200000).toISOString(),
    table_number: 5,
    server_name: "Sofia Chen",
    status: "preparing"
  }
];
