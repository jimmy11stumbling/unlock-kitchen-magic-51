
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
      reservationId: null,
      shape: "rectangle",
      position: { x: 100, y: 100 },
      // Make sure these properties match the TableLayout interface
      positionX: 100,
      positionY: 100,
      width: 80,
      height: 80,
      tableNumber: 1,
      seats: 4
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
      // Make sure these properties match the TableLayout interface
      positionX: 200,
      positionY: 100,
      width: 60,
      height: 60,
      tableNumber: 2,
      seats: 2
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
