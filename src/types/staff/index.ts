
// If the file already exists, add the following type definition:

export interface StaffDTO {
  id: number;
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  status?: string;
  salary?: number;
  hire_date?: string;
  schedule?: string | any;
  certifications?: string[] | string;
  performance_rating?: number;
  notes?: string;
  department?: string;
}
