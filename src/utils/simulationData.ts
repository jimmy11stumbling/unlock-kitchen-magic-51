
import type { 
  Reservation, 
  StaffMember, 
  MenuItem, 
  Order, 
  TableLayout,
  KitchenOrder,
  Shift
} from "@/types/staff";
import type { InventoryItem } from "@/hooks/dashboard/useInventoryData";
import { v4 as uuidv4 } from 'uuid';

// Helper to generate random dates within a range
const randomDate = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split('T')[0];
};

// Helper to generate random time
const randomTime = (): string => {
  const hours = Math.floor(Math.random() * 12) + 10; // 10 AM to 10 PM
  const minutes = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// Generate random phone number
const randomPhone = (): string => {
  return `555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
};

// Reservation simulation data
export const generateReservations = (count: number = 20): Reservation[] => {
  const statuses: Reservation['status'][] = ['pending', 'confirmed', 'cancelled', 'seated', 'completed', 'no-show'];
  const reservations: Reservation[] = [];
  
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + 14); // Two weeks into the future

  for (let i = 0; i < count; i++) {
    const date = randomDate(now, futureDate);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    reservations.push({
      id: i + 1,
      customerName: `Customer ${i + 1}`,
      customerEmail: Math.random() > 0.3 ? `customer${i + 1}@example.com` : undefined,
      customerPhone: randomPhone(),
      partySize: Math.floor(Math.random() * 8) + 1,
      date,
      time: randomTime(),
      tableNumber: Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 1 : undefined,
      status,
      notes: Math.random() > 0.7 ? `Special request for reservation ${i + 1}` : undefined,
      specialRequests: Math.random() > 0.8 ? `Allergen info for customer ${i + 1}` : undefined,
      createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: Math.random() > 0.5 ? new Date().toISOString() : undefined
    });
  }
  
  return reservations;
};

// Staff simulation data
export const generateStaffMembers = (count: number = 10): StaffMember[] => {
  const roles: StaffMember['role'][] = ['manager', 'chef', 'server', 'bartender', 'host', 'kitchen_staff', 'cleaner'];
  const statuses: StaffMember['status'][] = ['active', 'off_duty', 'on_break', 'on_leave', 'terminated'];
  const departments = ['kitchen', 'service', 'management', 'bar', 'cleaning'];
  const staff: StaffMember[] = [];
  
  const now = new Date();
  const pastDate = new Date();
  pastDate.setFullYear(now.getFullYear() - 5); // Up to 5 years in the past

  for (let i = 0; i < count; i++) {
    const role = roles[Math.floor(Math.random() * roles.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const hireDate = randomDate(pastDate, now);
    
    const salaryBase = role === 'manager' ? 60000 : 
                       role === 'chef' ? 50000 : 
                       role === 'bartender' ? 40000 : 35000;
    const salary = salaryBase + Math.floor(Math.random() * 10000);
    
    const defaultSchedule = {
      monday: "OFF",
      tuesday: "09:00-17:00",
      wednesday: "09:00-17:00",
      thursday: "09:00-17:00",
      friday: "09:00-17:00",
      saturday: Math.random() > 0.5 ? "11:00-19:00" : "OFF",
      sunday: Math.random() > 0.7 ? "11:00-19:00" : "OFF"
    };
    
    staff.push({
      id: i + 1,
      name: `Staff Member ${i + 1}`,
      role,
      email: `staff${i + 1}@restaurant.com`,
      phone: randomPhone(),
      status,
      salary,
      hireDate,
      schedule: defaultSchedule,
      certifications: role === 'chef' ? ['Food Safety', 'Culinary Arts'] : 
                     role === 'bartender' ? ['Mixology'] : 
                     role === 'manager' ? ['Management', 'Food Safety'] : 
                     ['Customer Service'],
      performanceRating: Math.floor(Math.random() * 3) + 7, // 7-10 rating
      notes: `Staff notes for ${role} ${i + 1}`,
      department
    });
  }
  
  return staff;
};

// Menu items simulation data
export const generateMenuItems = (count: number = 15): MenuItem[] => {
  const categories: MenuItem['category'][] = ['appetizer', 'main', 'dessert', 'beverage'];
  const allergens = ['gluten', 'dairy', 'nuts', 'shellfish', 'soy', 'eggs'];
  const menuItems: MenuItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const price = category === 'appetizer' ? 8 + Math.random() * 7 : 
                  category === 'main' ? 15 + Math.random() * 15 : 
                  category === 'dessert' ? 7 + Math.random() * 5 : 
                  4 + Math.random() * 6;
    
    const itemAllergens = [];
    for (const allergen of allergens) {
      if (Math.random() > 0.7) {
        itemAllergens.push(allergen);
      }
    }
    
    menuItems.push({
      id: i + 1,
      name: `Menu Item ${i + 1}`,
      price: parseFloat(price.toFixed(2)),
      category,
      description: `Description for menu item ${i + 1}`,
      available: Math.random() > 0.1, // 90% available
      allergens: itemAllergens,
      preparationTime: Math.floor(Math.random() * 20) + 5, // 5-25 minutes
      orderCount: Math.floor(Math.random() * 1000),
    });
  }
  
  return menuItems;
};

// Inventory items simulation data
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
      supplier: `Supplier ${Math.floor(Math.random() * 5) + 1}`,
      lastOrderDate: randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date()),
    });
  }
  
  return inventoryItems;
};

// Table layouts simulation data
export const generateTables = (count: number = 15): TableLayout[] => {
  const sections = ['Main', 'Bar', 'Patio', 'Private'];
  const statuses: TableLayout['status'][] = ['available', 'occupied', 'reserved', 'cleaning'];
  const tables: TableLayout[] = [];
  
  for (let i = 0; i < count; i++) {
    const section = sections[Math.floor(Math.random() * sections.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    tables.push({
      id: i + 1,
      number: i + 1,
      capacity: [2, 2, 4, 4, 4, 6, 8][Math.floor(Math.random() * 7)],
      section,
      status,
      activeOrder: status === 'occupied' ? Math.floor(Math.random() * 100) + 1 : null,
      reservationId: status === 'reserved' ? Math.floor(Math.random() * 20) + 1 : null,
    });
  }
  
  return tables;
};

// Order simulation data
export const generateOrders = (
  count: number = 25, 
  menuItems: MenuItem[] = generateMenuItems()
): Order[] => {
  const statuses: Order['status'][] = ['pending', 'preparing', 'ready', 'delivered', 'paid', 'cancelled'];
  const orders: Order[] = [];
  
  const now = new Date();
  const pastDate = new Date();
  pastDate.setDate(now.getDate() - 7); // Last week
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const orderItems = [];
    let total = 0;
    
    // Add random items to the order
    for (let j = 0; j < itemCount; j++) {
      const menuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const itemTotal = menuItem.price * quantity;
      total += itemTotal;
      
      orderItems.push({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        notes: Math.random() > 0.8 ? `Special request for ${menuItem.name}` : '',
        category: menuItem.category,
        station: menuItem.category === 'appetizer' || menuItem.category === 'dessert' ? 'cold' : 'hot'
      });
    }
    
    orders.push({
      id: i + 1,
      tableNumber: Math.floor(Math.random() * 15) + 1,
      serverName: `Server ${Math.floor(Math.random() * 5) + 1}`,
      items: orderItems,
      status,
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date(pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime())).toISOString(),
      guestCount: Math.floor(Math.random() * 6) + 1,
      estimatedPrepTime: Math.floor(Math.random() * 30) + 15,
    });
  }
  
  return orders;
};

// Kitchen orders simulation data
export const generateKitchenOrders = (count: number = 15): KitchenOrder[] => {
  const statuses: KitchenOrder['status'][] = ['pending', 'preparing', 'ready', 'delivered'];
  const priorities: KitchenOrder['priority'][] = ['low', 'normal', 'high', 'rush'];
  const kitchenOrders: KitchenOrder[] = [];
  
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const kitchenItems = [];
    
    // Create kitchen order items
    for (let j = 0; j < itemCount; j++) {
      const itemStatus = ['pending', 'cooking', 'ready', 'delivered'][Math.floor(Math.random() * 4)];
      
      kitchenItems.push({
        id: j + 1,
        menuItemId: Math.floor(Math.random() * 15) + 1,
        name: `Item ${j + 1} for Order ${i + 1}`,
        quantity: Math.floor(Math.random() * 3) + 1,
        status: itemStatus,
        cookingStation: ['grill', 'fry', 'salad', 'dessert'][Math.floor(Math.random() * 4)],
        notes: Math.random() > 0.8 ? 'Special preparation notes' : ''
      });
    }
    
    // Calculate estimated delivery time
    const deliveryTime = new Date(now.getTime() + (Math.floor(Math.random() * 40) + 5) * 60 * 1000);
    
    kitchenOrders.push({
      id: i + 1,
      orderId: i + 1,
      tableNumber: Math.floor(Math.random() * 15) + 1,
      serverName: `Server ${Math.floor(Math.random() * 5) + 1}`,
      items: kitchenItems,
      status,
      priority,
      created_at: new Date(now.getTime() - (Math.floor(Math.random() * 60) + 5) * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      estimatedDeliveryTime: deliveryTime.toISOString(),
      coursing: ['standard', 'appetizer', 'main', 'dessert'][Math.floor(Math.random() * 4)]
    });
  }
  
  return kitchenOrders;
};

// Shifts simulation data
export const generateShifts = (count: number = 20): Shift[] => {
  const statuses: Shift['status'][] = ['scheduled', 'completed', 'missed', 'in_progress'];
  const shifts: Shift[] = [];
  
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Start of the current week (Sunday)
  
  for (let i = 0; i < count; i++) {
    const dayOffset = Math.floor(Math.random() * 14) - 7; // -7 to +7 days from today
    const date = new Date(weekStart);
    date.setDate(date.getDate() + dayOffset);
    
    const startHour = Math.floor(Math.random() * 8) + 8; // 8 AM to 4 PM
    const shiftLength = Math.floor(Math.random() * 4) + 6; // 6 to 10 hours
    const endHour = startHour + shiftLength;
    
    shifts.push({
      id: i + 1,
      staffId: Math.floor(Math.random() * 10) + 1,
      date: date.toISOString().split('T')[0],
      startTime: `${startHour.toString().padStart(2, '0')}:00`,
      endTime: `${endHour.toString().padStart(2, '0')}:00`,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  
  return shifts;
};

// Main function to generate all simulation data
export const generateAllSimulationData = () => {
  const staff = generateStaffMembers(10);
  const menuItems = generateMenuItems(15);
  const inventoryItems = generateInventoryItems(30);
  const tables = generateTables(15);
  const reservations = generateReservations(20);
  const orders = generateOrders(25, menuItems);
  const kitchenOrders = generateKitchenOrders(15);
  const shifts = generateShifts(20);
  
  return {
    staff,
    menuItems,
    inventoryItems,
    tables,
    reservations,
    orders,
    kitchenOrders,
    shifts
  };
};

// Function to initialize the app with simulation data
export const initializeWithSimulationData = () => {
  const data = generateAllSimulationData();
  
  // Store data in localStorage for persistence
  localStorage.setItem('simulationData', JSON.stringify(data));
  
  return data;
};

// Function to retrieve simulation data
export const getSimulationData = () => {
  const storedData = localStorage.getItem('simulationData');
  if (storedData) {
    return JSON.parse(storedData);
  } else {
    return initializeWithSimulationData();
  }
};

// Function to clear simulation data
export const clearSimulationData = () => {
  localStorage.removeItem('simulationData');
};
