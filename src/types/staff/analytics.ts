
export interface DailyReport {
  id?: number;
  date: string;
  sales: {
    total: number;
    food: number;
    beverage: number;
    alcohol: number;
    other: number;
  };
  transactions: {
    count: number;
    average: number;
    cash: number;
    card: number;
    mobile: number;
  };
  labor: {
    hours: number;
    cost: number;
    efficiency: number;
  };
  inventory: {
    usage: number;
    waste: number;
    cost: number;
  };
}
