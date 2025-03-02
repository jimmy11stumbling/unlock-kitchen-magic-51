
import type { TableLayout as TableLayoutType } from "@/types/staff/table";

// Generate mock tables
const generateTables = (): TableLayoutType[] => {
  return [
    {
      id: 1,
      number: 1,
      capacity: 4,
      section: "Main",
      status: "available",
      activeOrder: null,
      shape: "rectangle",
      // Replace position with positionX and positionY
      positionX: 100,
      positionY: 100,
      width: 80,
      height: 80,
      tableNumber: 1,
      seats: 4,
      currentOrderId: null,
      rotation: 0,
      serverAssigned: undefined,
      notes: "",
      reservationId: null
    },
    {
      id: 2,
      number: 2,
      capacity: 2,
      section: "Main",
      status: "available",
      activeOrder: null,
      shape: "round",
      // Replace position with positionX and positionY
      positionX: 200,
      positionY: 100,
      width: 60,
      height: 60,
      tableNumber: 2,
      seats: 2,
      currentOrderId: null,
      rotation: 0,
      serverAssigned: undefined,
      notes: "",
      reservationId: null
    }
  ];
};

// Add simulation data functions
export const initializeWithSimulationData = () => {
  const simulationData = {
    tables: generateTables(),
    staff: [],
    inventory: [],
    orders: [],
    kitchenOrders: [],
    menuItems: [],
    reservations: [],
    shifts: []
  };
  
  // Save to localStorage for persistence
  localStorage.setItem('simulationData', JSON.stringify(simulationData));
  return simulationData;
};

export const getSimulationData = () => {
  const data = localStorage.getItem('simulationData');
  return data ? JSON.parse(data) : null;
};

export const clearSimulationData = () => {
  localStorage.removeItem('simulationData');
};
