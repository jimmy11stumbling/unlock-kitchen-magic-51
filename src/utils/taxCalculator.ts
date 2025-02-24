
export const calculateTax = (amount: number, rate: number = 0.08) => {
  const tax = Number((amount * rate).toFixed(2));
  const total = Number((amount + tax).toFixed(2));
  return { tax, total };
};

export const calculateTaxBreakdown = (amount: number, rates: { [key: string]: number }) => {
  const breakdown: { [key: string]: number } = {};
  let total = 0;
  
  Object.entries(rates).forEach(([name, rate]) => {
    breakdown[name] = Number((amount * rate).toFixed(2));
    total += breakdown[name];
  });
  
  return { breakdown, total: Number(total.toFixed(2)) };
};

export const formatTaxAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const getAvailableStates = (): string[] => {
  return [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California",
    "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
    "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
    "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
    "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
    "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
    "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
    "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];
};
