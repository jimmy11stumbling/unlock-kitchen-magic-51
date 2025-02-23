
interface StateTax {
  state: string;
  rate: number;
  foodTaxed: boolean;
  prepared_food_rate?: number;
}

const STATE_TAX_RATES: StateTax[] = [
  { state: 'Alabama', rate: 0.04, foodTaxed: true },
  { state: 'Alaska', rate: 0, foodTaxed: false },
  { state: 'Arizona', rate: 0.056, foodTaxed: false },
  { state: 'Arkansas', rate: 0.065, foodTaxed: true },
  { state: 'California', rate: 0.0725, foodTaxed: false },
  { state: 'Colorado', rate: 0.029, foodTaxed: false },
  { state: 'Connecticut', rate: 0.0635, foodTaxed: false, prepared_food_rate: 0.0735 },
  { state: 'Delaware', rate: 0, foodTaxed: false },
  { state: 'Florida', rate: 0.06, foodTaxed: false },
  { state: 'Georgia', rate: 0.04, foodTaxed: false },
  { state: 'Hawaii', rate: 0.04, foodTaxed: true },
  { state: 'Idaho', rate: 0.06, foodTaxed: false },
  { state: 'Illinois', rate: 0.0625, foodTaxed: true, prepared_food_rate: 0.0825 },
  { state: 'Indiana', rate: 0.07, foodTaxed: false },
  { state: 'Iowa', rate: 0.06, foodTaxed: false },
  { state: 'Kansas', rate: 0.065, foodTaxed: true },
  { state: 'Kentucky', rate: 0.06, foodTaxed: false },
  { state: 'Louisiana', rate: 0.0445, foodTaxed: false },
  { state: 'Maine', rate: 0.055, foodTaxed: false },
  { state: 'Maryland', rate: 0.06, foodTaxed: false },
  { state: 'Massachusetts', rate: 0.0625, foodTaxed: false, prepared_food_rate: 0.07 },
  { state: 'Michigan', rate: 0.06, foodTaxed: false },
  { state: 'Minnesota', rate: 0.06875, foodTaxed: false },
  { state: 'Mississippi', rate: 0.07, foodTaxed: true },
  { state: 'Missouri', rate: 0.04225, foodTaxed: true },
  { state: 'Montana', rate: 0, foodTaxed: false },
  { state: 'Nebraska', rate: 0.055, foodTaxed: false },
  { state: 'Nevada', rate: 0.0685, foodTaxed: false },
  { state: 'New Hampshire', rate: 0, foodTaxed: false },
  { state: 'New Jersey', rate: 0.06625, foodTaxed: false },
  { state: 'New Mexico', rate: 0.05125, foodTaxed: true },
  { state: 'New York', rate: 0.04, foodTaxed: false },
  { state: 'North Carolina', rate: 0.0475, foodTaxed: false },
  { state: 'North Dakota', rate: 0.05, foodTaxed: false },
  { state: 'Ohio', rate: 0.0575, foodTaxed: false },
  { state: 'Oklahoma', rate: 0.045, foodTaxed: true },
  { state: 'Oregon', rate: 0, foodTaxed: false },
  { state: 'Pennsylvania', rate: 0.06, foodTaxed: false },
  { state: 'Rhode Island', rate: 0.07, foodTaxed: false },
  { state: 'South Carolina', rate: 0.06, foodTaxed: false },
  { state: 'South Dakota', rate: 0.045, foodTaxed: true },
  { state: 'Tennessee', rate: 0.07, foodTaxed: true },
  { state: 'Texas', rate: 0.0625, foodTaxed: false },
  { state: 'Utah', rate: 0.0485, foodTaxed: true },
  { state: 'Vermont', rate: 0.06, foodTaxed: false },
  { state: 'Virginia', rate: 0.053, foodTaxed: false, prepared_food_rate: 0.055 },
  { state: 'Washington', rate: 0.065, foodTaxed: false },
  { state: 'West Virginia', rate: 0.06, foodTaxed: true },
  { state: 'Wisconsin', rate: 0.05, foodTaxed: false },
  { state: 'Wyoming', rate: 0.04, foodTaxed: false }
];

export const calculateTax = (subtotal: number, state: string): { tax: number; total: number } => {
  const stateTax = STATE_TAX_RATES.find(tax => tax.state === state);
  
  if (!stateTax) {
    console.warn(`Tax rate not found for state: ${state}`);
    return { tax: 0, total: subtotal };
  }

  // Use prepared food rate if available, otherwise use standard rate
  const taxRate = stateTax.prepared_food_rate || stateTax.rate;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2))
  };
};

export const getAvailableStates = (): string[] => {
  return STATE_TAX_RATES.map(tax => tax.state);
};
