
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
      // Make sure these properties match the TableLayout interface
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
      // Make sure these properties match the TableLayout interface
      positionX: 200,
      positionY: 100,
      width: 60,
      height: 60
    }
  ];
};
