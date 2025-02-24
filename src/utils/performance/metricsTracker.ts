
export const calculateMetrics = (data: number[]) => {
  const average = data.reduce((a, b) => a + b, 0) / data.length;
  const max = Math.max(...data);
  const min = Math.min(...data);
  
  return {
    average: Number(average.toFixed(2)),
    max,
    min,
    trend: ((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(1)
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const calculateGrowth = (current: number, previous: number) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};
