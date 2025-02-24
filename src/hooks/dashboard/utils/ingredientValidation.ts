
import { PrepDetails } from '../types/ingredientTypes';

export const MINIMUM_STOCK_THRESHOLD = 0;
export const MAXIMUM_STOCK_THRESHOLD = 100000;
export const DEFAULT_PREP_TIME = 15;
export const MAX_RETRIES = 3;
export const BASE_RETRY_DELAY = 1000;

export const isValidPrepDetails = (data: unknown): data is PrepDetails => {
  if (typeof data !== 'object' || !data) return false;
  
  const details = data as Record<string, unknown>;
  return (
    Array.isArray(details.steps) &&
    Array.isArray(details.equipment_needed) &&
    details.steps.every(step => 
      typeof step === 'object' && 
      step !== null && 
      'duration' in step && 
      typeof step.duration === 'number'
    ) &&
    details.equipment_needed.every(item => typeof item === 'string')
  );
};

export const isValidStockQuantity = (quantity: number): boolean => {
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    return false;
  }
  return quantity >= MINIMUM_STOCK_THRESHOLD && 
         quantity <= MAXIMUM_STOCK_THRESHOLD &&
         Number.isInteger(quantity);
};
