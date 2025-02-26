
export const mockOrders = [
  {
    id: 1,
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 60000).toISOString(),
    status: 'delivered',
    total: 75.50,
    items: [
      { name: 'Grilled Salmon', quantity: 2, price: 25.99 },
      { name: 'Caesar Salad', quantity: 1, price: 12.99 },
      { name: 'House Wine', quantity: 1, price: 8.99 }
    ],
    estimated_prep_time: new Date(Date.now() - 20 * 60000).toISOString()
  },
  {
    id: 2,
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 60000).toISOString(),
    status: 'delivered',
    total: 92.75,
    items: [
      { name: 'Ribeye Steak', quantity: 2, price: 34.99 },
      { name: 'Truffle Fries', quantity: 2, price: 8.99 },
      { name: 'Craft Beer', quantity: 2, price: 7.99 }
    ],
    estimated_prep_time: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'pending',
    total: 45.97,
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 18.99 },
      { name: 'Garlic Knots', quantity: 2, price: 6.99 },
      { name: 'Tiramisu', quantity: 1, price: 8.99 }
    ],
    estimated_prep_time: new Date(Date.now() + 20 * 60000).toISOString()
  }
];

export const mockStaffData = [
  {
    id: 1,
    name: 'John Smith',
    role: 'chef',
    status: 'active',
    shift: 'morning'
  },
  {
    id: 2,
    name: 'Maria Garcia',
    role: 'sous_chef',
    status: 'active',
    shift: 'evening'
  },
  {
    id: 3,
    name: 'David Chen',
    role: 'line_cook',
    status: 'active',
    shift: 'morning'
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    role: 'server',
    status: 'active',
    shift: 'evening'
  }
];

export const mockInventoryData = [
  {
    id: 1,
    name: 'Fresh Salmon',
    current_stock: 5,
    minimum_stock: 10,
    unit: 'kg'
  },
  {
    id: 2,
    name: 'Ribeye Steak',
    current_stock: 3,
    minimum_stock: 8,
    unit: 'kg'
  },
  {
    id: 3,
    name: 'Olive Oil',
    current_stock: 2,
    minimum_stock: 5,
    unit: 'liters'
  }
];

export const generateMockSalesData = (timeFrame: string) => {
  const data = [];
  const periods = timeFrame === 'today' ? 24 : timeFrame === 'week' ? 7 : 30;
  const maxValue = 1000;
  const minValue = 100;
  
  for (let i = 0; i < periods; i++) {
    data.push({
      name: timeFrame === 'today' ? `${i}:00` : `Day ${i + 1}`,
      value: Math.floor(Math.random() * (maxValue - minValue) + minValue)
    });
  }
  
  return data;
};
