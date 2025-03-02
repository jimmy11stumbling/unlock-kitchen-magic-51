
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
