import type { InventoryItem, StaffMember, MenuItem, TableLayout, Reservation, Order, KitchenOrder, Shift } from "@/types/staff";

// Helper function for random dates
const randomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString();
};

// Only change the supplier property to supplierId in the generateInventoryItems function
export const generateInventoryItems = (count: number = 30): InventoryItem[] => {
  const categories = ['produce', 'meat', 'dairy', 'dry goods', 'beverages', 'spices', 'cleaning'];
  const inventoryItems: InventoryItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const minQuantity = Math.floor(Math.random() * 10) + 5;
    const quantity = Math.floor(Math.random() * 30) + (Math.random() > 0.2 ? minQuantity : 0);
    const price = category === 'meat' ? 15 + Math.random() * 25 : 
                  category === 'produce' ? 2 + Math.random() * 8 : 
                  5 + Math.random() * 15;
                  
    inventoryItems.push({
      id: i + 1,
      name: `Inventory Item ${i + 1}`,
      category,
      quantity,
      minQuantity,
      price: parseFloat(price.toFixed(2)),
      unit: category === 'beverages' ? 'bottle' : 
            category === 'meat' ? 'kg' : 
            category === 'produce' ? 'lb' : 'unit',
      supplierId: Math.floor(Math.random() * 5) + 1,
      lastOrderDate: randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date()),
    });
  }
  
  return inventoryItems;
};

// Generate mock staff
const generateStaff = (): StaffMember[] => {
  return [
    {
      id: 1,
      name: "John Doe",
      role: "manager",
      email: "john.doe@restaurant.com",
      phone: "555-123-4567",
      status: "active",
      salary: 65000,
      hireDate: "2020-01-15",
      schedule: {
        monday: "09:00-17:00",
        tuesday: "09:00-17:00",
        wednesday: "09:00-17:00",
        thursday: "09:00-17:00",
        friday: "09:00-17:00"
      },
      certifications: ["Food Safety", "Management"],
      performanceRating: 9,
      notes: "Senior manager",
      department: "Management"
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "chef",
      email: "jane.smith@restaurant.com",
      phone: "555-987-6543",
      status: "active",
      salary: 55000,
      hireDate: "2021-03-10",
      schedule: {
        monday: "14:00-22:00",
        tuesday: "14:00-22:00",
        thursday: "14:00-22:00",
        friday: "14:00-22:00",
        saturday: "14:00-22:00"
      },
      certifications: ["Culinary Arts", "Food Safety"],
      performanceRating: 8,
      notes: "Head chef",
      department: "Kitchen"
    }
  ];
};

// Generate mock menu items
const generateMenuItems = (): MenuItem[] => {
  return [
    {
      id: 1,
      name: "Classic Burger",
      price: 14.99,
      category: "main",
      description: "Angus beef patty with lettuce, tomato, and special sauce",
      available: true,
      allergens: ["gluten", "dairy"],
      preparationTime: 15,
      orderCount: 1250
    },
    {
      id: 2,
      name: "Caesar Salad",
      price: 10.99,
      category: "appetizer",
      description: "Crisp romaine lettuce, croutons, parmesan cheese",
      available: true,
      allergens: ["gluten", "dairy", "eggs"],
      preparationTime: 10,
      orderCount: 980
    }
  ];
};

// Generate mock tables
const generateTables = (): TableLayout[] => {
  return [
    {
      id: 1,
      number: 1,
      capacity: 4,
      section: "Main",
      status: "available",
      activeOrder: null,
      reservationId: null,
      shape: "rectangle",
      position: { x: 100, y: 100 },
      seats: 4,
      positionX: 100,
      positionY: 100,
      width: 80,
      height: 80
    },
    {
      id: 2,
      number: 2,
      capacity: 2,
      section: "Main",
      status: "available",
      activeOrder: null,
      reservationId: null,
      shape: "circle",
      position: { x: 200, y: 100 },
      seats: 2,
      positionX: 200,
      positionY: 100,
      width: 60,
      height: 60
    }
  ];
};

// Generate mock reservations
const generateReservations = (): Reservation[] => {
  return [
    {
      id: 1,
      customerName: "Alice Johnson",
      customerEmail: "alice@example.com",
      customerPhone: "555-111-2222",
      partySize: 4,
      date: "2023-07-15",
      time: "18:00",
      tableNumber: 1,
      status: "confirmed",
      notes: "Birthday celebration",
      specialRequests: "Window table if possible",
      createdAt: "2023-07-10T10:00:00Z",
      updatedAt: "2023-07-10T10:05:00Z"
    }
  ];
};

// Generate mock orders
const generateOrders = (): Order[] => {
  return [
    {
      id: 1,
      tableNumber: 1,
      serverName: "John Server",
      items: [
        { id: 1, name: "Classic Burger", price: 14.99, quantity: 2 },
        { id: 2, name: "Caesar Salad", price: 10.99, quantity: 1 }
      ],
      status: "pending",
      total: 40.97,
      timestamp: new Date().toISOString(),
      guestCount: 2,
      estimatedPrepTime: 20,
      notes: "No onions on burger"
    }
  ];
};

// Generate mock kitchen orders
const generateKitchenOrders = (): KitchenOrder[] => {
  return [
    {
      id: 1,
      order_id: 1,
      tableNumber: 1,
      serverName: "John Server",
      items: [
        {
          id: 1,
          menu_item_id: 1,
          name: "Classic Burger",
          quantity: 2,
          status: "pending",
          cooking_station: "grill",
          modifications: ["No onions"],
          allergen_alert: false
        }
      ],
      status: "pending",
      priority: "normal",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      estimated_delivery_time: new Date(Date.now() + 20 * 60000).toISOString(),
      notes: "",
      table_number: 1, // For database compatibility
      server_name: "John Server" // For database compatibility
    }
  ];
};

// Generate mock shifts
const generateShifts = (): Shift[] => {
  return [
    {
      id: 1,
      staffId: 1,
      date: "2023-07-15",
      startTime: "09:00",
      endTime: "17:00",
      status: "scheduled",
      notes: ""
    },
    {
      id: 2,
      staffId: 2,
      date: "2023-07-15",
      startTime: "14:00",
      endTime: "22:00",
      status: "scheduled",
      notes: ""
    }
  ];
};

// Implementation of the simulation data functions
export const initializeWithSimulationData = () => {
  const data = {
    staff: generateStaff(),
    menuItems: generateMenuItems(),
    inventory: generateInventoryItems(10),
    tables: generateTables(),
    reservations: generateReservations(),
    orders: generateOrders(),
    kitchenOrders: generateKitchenOrders(),
    shifts: generateShifts()
  };
  
  localStorage.setItem('simulationData', JSON.stringify(data));
  return data;
};

export const getSimulationData = () => {
  const data = localStorage.getItem('simulationData');
  if (!data) return null;
  return JSON.parse(data);
};

export const clearSimulationData = () => {
  localStorage.removeItem('simulationData');
  return true;
};
