
const stationMap: Record<number, string> = {
  1: "grill",
  2: "cold-line",
  3: "soup",
  4: "cold-line",
  5: "pastry",
  6: "bar",
  7: "hot-line",
  8: "pastry"
};

const chefMap: Record<string, string> = {
  "grill": "Isabella Martinez",
  "hot-line": "Isabella Martinez",
  "cold-line": "James Wilson",
  "soup": "James Wilson",
  "pastry": "Maria Garcia",
  "bar": "Alex Thompson"
};

export const determineStation = (itemId: number): string => {
  return stationMap[itemId] || "misc";
};

export const assignChef = (itemId: number): string => {
  return chefMap[determineStation(itemId)] || "Unassigned";
};

export const calculateEstimatedPrepTime = (
  items: Array<{ id: number; quantity: number }>,
  menuItems: any[]
): number => {
  return Math.max(
    ...items.map(item => {
      const menuItem = menuItems.find(m => m.id === item.id);
      return (menuItem?.preparationTime || 0) * item.quantity;
    })
  );
};

export const checkAllergenConflicts = (
  itemId: number,
  customerAllergies: string[],
  menuItems: any[]
): boolean => {
  const menuItem = menuItems.find(item => item.id === itemId);
  if (!menuItem) return false;
  return menuItem.allergens.some(allergen => customerAllergies.includes(allergen));
};

export const optimizeCourseOrder = (
  items: Array<{ id: number; quantity: number }>,
  menuItems: any[]
): string => {
  const hasAppetizers = items.some(item => {
    const menuItem = menuItems.find(m => m.id === item.id);
    return menuItem?.category === "appetizer";
  });

  const hasDesserts = items.some(item => {
    const menuItem = menuItems.find(m => m.id === item.id);
    return menuItem?.category === "dessert";
  });

  if (hasAppetizers && hasDesserts) {
    return "appetizers first";
  } else if (hasDesserts) {
    return "desserts after clearing mains";
  }
  return "standard";
};

export const validateOrderCompletion = (items: KitchenOrder["items"]): boolean => {
  return items.every(item => item.status === "ready");
};

interface KitchenOrder {
  items: Array<{
    status: string;
  }>;
}
