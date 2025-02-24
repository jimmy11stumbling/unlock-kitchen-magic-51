
export const calculateTax = (amount: number, rate: number = 0.08): number => {
  return Number((amount * rate).toFixed(2));
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
