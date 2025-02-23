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
    specialInstructions: "Allergy Alert: Guest has dairy sensitivity",
    guestCount: 4,
    estimatedPrepTime: 35
  },
  {
    id: 2,
    tableNumber: 3,
    status: "preparing",
    items: [
      { id: 7, name: "Seafood Paella", quantity: 2, price: 34.99 },
      { id: 4, name: "Tuna Tartare", quantity: 1, price: 19.99 },
      { id: 5, name: "Crème Brûlée", quantity: 2, price: 12.99 }
    ],
    total: 115.95,
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    serverName: "James Wilson",
    specialInstructions: "VIP Guest - Owner's family",
    guestCount: 2,
    estimatedPrepTime: 45
  },
  {
    id: 3,
    tableNumber: 7,
    status: "ready",
    items: [
      { id: 2, name: "Mediterranean Quinoa Bowl", quantity: 1, price: 18.99 },
      { id: 8, name: "Chocolate Soufflé", quantity: 2, price: 14.99 }
    ],
    total: 48.97,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    serverName: "Maria Garcia",
    specialInstructions: "Gluten-free preparation required",
    guestCount: 3,
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
        quantity: 2,
        status: "preparing",
        startTime: new Date(Date.now() - 900000).toISOString(),
        cookingStation: "grill",
        assignedChef: "Isabella Martinez",
        modifications: [
          "1x Medium Rare",
          "1x Medium Well",
          "Extra truffle aioli on side"
        ],
        allergenAlert: true
      },
      {
        menuItemId: 3,
        quantity: 1,
        status: "pending",
        startTime: new Date(Date.now() - 600000).toISOString(),
        cookingStation: "soup",
        assignedChef: "James Wilson",
        modifications: ["Extra garnish"],
        allergenAlert: true
      }
    ],
    priority: "high",
    notes: "Dairy sensitivity - use dairy-free alternatives where possible",
    coursing: "appetizers first",
    estimatedDeliveryTime: new Date(Date.now() + 1200000).toISOString()
  },
  {
    id: 2,
    orderId: 2,
    items: [
      {
        menuItemId: 7,
        quantity: 2,
        status: "preparing",
        startTime: new Date(Date.now() - 1200000).toISOString(),
        cookingStation: "hot-line",
        assignedChef: "Isabella Martinez",
        modifications: ["Extra crispy rice"],
        allergenAlert: true
      },
      {
        menuItemId: 4,
        quantity: 1,
        status: "ready",
        startTime: new Date(Date.now() - 1500000).toISOString(),
        completionTime: new Date(Date.now() - 900000).toISOString(),
        cookingStation: "cold-line",
        assignedChef: "James Wilson",
        modifications: [],
        allergenAlert: false
      },
      {
        menuItemId: 5,
        quantity: 2,
        status: "pending",
        startTime: new Date(Date.now() - 300000).toISOString(),
        cookingStation: "pastry",
        assignedChef: "Maria Garcia",
        modifications: [],
        allergenAlert: false
      }
    ],
    priority: "rush",
    notes: "VIP - Owner's family. Ensure perfect presentation.",
    coursing: "serve together",
    estimatedDeliveryTime: new Date(Date.now() + 900000).toISOString()
  },
  {
    id: 3,
    orderId: 3,
    items: [
      {
        menuItemId: 2,
        quantity: 1,
        status: "ready",
        startTime: new Date(Date.now() - 1800000).toISOString(),
        completionTime: new Date(Date.now() - 1200000).toISOString(),
        cookingStation: "cold-line",
        assignedChef: "James Wilson",
        modifications: ["No feta", "Extra vegetables"],
        allergenAlert: false
      },
      {
        menuItemId: 8,
        quantity: 2,
        status: "preparing",
        startTime: new Date(Date.now() - 900000).toISOString(),
        cookingStation: "pastry",
        assignedChef: "Maria Garcia",
        modifications: ["1x Regular", "1x Gluten-free"],
        allergenAlert: true
      }
    ],
    priority: "normal",
    notes: "Gluten-free soufflé must be prepared in separate area",
    coursing: "desserts after clearing mains",
    estimatedDeliveryTime: new Date(Date.now() + 600000).toISOString()
  }
];
