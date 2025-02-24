
import { PostgrestError } from '@supabase/supabase-js';

export const handleDatabaseError = (error: PostgrestError): never => {
  if (error.code === '42P01') {
    throw new Error('Ingredients table not found. Please ensure the database is properly set up.');
  }
  if (error.code === '28P01') {
    throw new Error('Database connection error. Please check your credentials.');
  }
  if (error.code === '23505') {
    throw new Error('This ingredient already exists.');
  }
  throw new Error(`Database error: ${error.message}`);
};
