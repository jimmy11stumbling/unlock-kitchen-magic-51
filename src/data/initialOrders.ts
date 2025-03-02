import { KitchenOrderItem, KitchenOrder } from "@/types/staff";

// Create properly structured kitchen order items
const createKitchenOrderItems = (items: any[]): KitchenOrderItem[] => {
  return items.map((item, index) => ({
    id: index + 1,
    menuItemId: item.menu_item_id || item.id,
    name: item.name,
    quantity: item.quantity,
    status: "pending",
    cookingStation: item.cooking_station || "grill",
    notes: item.notes || ""
  }));
};

// Create a properly structured kitchen order
export const createKitchenOrder = (orderId: number, tableNumber: number, items: any[]): KitchenOrder => {
  return {
    id: Math.floor(Math.random() * 1000),
    orderId: orderId,
    tableNumber: tableNumber,
    serverName: "Server",
    items: createKitchenOrderItems(items),
    status: "pending",
    priority: "normal",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(),
    coursing: "standard"
  };
};

// Initial sample orders
export const initialOrders = [
  {
    id: 1,
    order_id: 101,
    table_number: 5,
    server_name: "Alice",
    items: [
      {
        id: 1,
        menu_item_id: 201,
        name: "Burger",
        quantity: 2,
        status: "pending",
        cooking_station: "grill",
        notes: "Medium-rare"
      },
      {
        id: 2,
        menu_item_id: 202,
        name: "Fries",
        quantity: 1,
        status: "pending",
        cooking_station: "fryer",
        notes: "Extra crispy"
      }
    ],
    status: "pending",
    priority: "normal",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estimated_delivery_time: new Date(Date.now() + 30 * 60000).toISOString(),
    coursing: "standard"
  },
  {
    id: 2,
    order_id: 102,
    table_number: 3,
    server_name: "Bob",
    items: [
      {
        id: 3,
        menu_item_id: 203,
        name: "Pizza",
        quantity: 1,
        status: "pending",
        cooking_station: "oven",
        notes: "No olives"
      },
      {
        id: 4,
        menu_item_id: 204,
        name: "Salad",
        quantity: 1,
        status: "pending",
        cooking_station: "prep",
        notes: "Extra dressing"
      }
    ],
    status: "pending",
    priority: "normal",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estimated_delivery_time: new Date(Date.now() + 45 * 60000).toISOString(),
    coursing: "standard"
  }
];
